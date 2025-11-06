import os
import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token, 
    JWTManager, 
    jwt_required, 
    get_jwt_identity
)

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'salute_facile.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["JWT_SECRET_KEY"] = "la-tua-chiave-segreta-molto-difficile-e-casuale"

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class Utente(db.Model):
    __tablename__ = 'utenti'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    nome = db.Column(db.String(80), nullable=False)
    cognome = db.Column(db.String(80), nullable=False)
    ruolo = db.Column(db.String(20), nullable=False, default='paziente')
    
    appuntamenti_paziente = db.relationship('Appuntamento', 
                                            foreign_keys='Appuntamento.paziente_id', 
                                            back_populates='paziente')

class Medico(db.Model):
    __tablename__ = 'medici'
    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(160), nullable=False)
    specializzazione = db.Column(db.String(100), nullable=False)
    descrizione = db.Column(db.Text, nullable=True)
    
    disponibilita = db.relationship('Disponibilita', back_populates='medico')

class Disponibilita(db.Model):
    __tablename__ = 'disponibilita'
    id = db.Column(db.Integer, primary_key=True)
    data_inizio = db.Column(db.DateTime, nullable=False)
    data_fine = db.Column(db.DateTime, nullable=False)
    è_prenotato = db.Column(db.Boolean, default=False, nullable=False)
    
    medico_id = db.Column(db.Integer, db.ForeignKey('medici.id'), nullable=False)
    medico = db.relationship('Medico', back_populates='disponibilita')
    appuntamento = db.relationship('Appuntamento', back_populates='slot_disponibile', uselist=False)

class Appuntamento(db.Model):
    __tablename__ = 'appuntamenti'
    id = db.Column(db.Integer, primary_key=True)
    data_prenotazione = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    stato = db.Column(db.String(50), default='Confermato')
    
    paziente_id = db.Column(db.Integer, db.ForeignKey('utenti.id'), nullable=False)
    disponibilita_id = db.Column(db.Integer, db.ForeignKey('disponibilita.id'), unique=True, nullable=False)
    
    paziente = db.relationship('Utente', back_populates='appuntamenti_paziente')
    slot_disponibile = db.relationship('Disponibilita', back_populates='appuntamento')

@app.route("/")
def home():
    return "Backend SaluteFacile Attivo! (JWT, Bcrypt, SQLAlchemy)"

@app.route("/api/register", methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    nome = data.get('nome')
    cognome = data.get('cognome')

    if not email or not password or not nome or not cognome:
        return jsonify({"errore": "Campi mancanti (email, password, nome, cognome)"}), 400

    # Controlla se l'email è già in uso
    utente_esistente = Utente.query.filter_by(email=email).first()
    if utente_esistente:
        return jsonify({"errore": "Email già registrata"}), 409

    # Crea l'hash della password per non salvarla in chiaro
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    nuovo_utente = Utente(
        email=email,
        password_hash=hashed_password,
        nome=nome,
        cognome=cognome,
        ruolo='paziente'
    )
    
    try:
        db.session.add(nuovo_utente)
        db.session.commit()
        return jsonify({
            "messaggio": "Utente registrato con successo!",
            "utente": {"id": nuovo_utente.id, "email": nuovo_utente.email, "nome": nuovo_utente.nome}
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"errore": f"Errore del database: {str(e)}"}), 500

@app.route("/api/login", methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"errore": "Email e password sono obbligatori"}), 400

    utente = Utente.query.filter_by(email=email).first()

    if utente and bcrypt.check_password_hash(utente.password_hash, password):
        access_token = create_access_token(identity=str(utente.id)) 
        
        return jsonify({
            "messaggio": "Login effettuato con successo",
            "access_token": access_token,
            "utente": {"id": utente.id, "email": utente.email, "nome": utente.nome}
        }), 200
    else:
        return jsonify({"errore": "Credenziali non valide"}), 401

@app.route("/api/profilo", methods=['GET'])
@jwt_required()
def get_profilo():
    current_user_id = get_jwt_identity()
    
    utente = Utente.query.get(current_user_id)
    
    if not utente:
        return jsonify({"errore": "Utente non trovato"}), 404
        
    return jsonify({
        "id": utente.id,
        "email": utente.email,
        "nome": utente.nome,
        "cognome": utente.cognome,
        "ruolo": utente.ruolo
    }), 200

@app.route("/api/medici", methods=['GET'])
def get_medici():
    try:
        medici_dal_db = Medico.query.all()
        lista_medici_json = []
        for medico in medici_dal_db:
            lista_medici_json.append({
                "id": medico.id,
                "nome_completo": medico.nome_completo,
                "specializzazione": medico.specializzazione,
                "descrizione": medico.descrizione
            })
        
        return jsonify(lista_medici_json)
    
    except Exception as e:
        return jsonify({"errore": str(e)}), 500

@app.route("/api/medici/<int:medico_id>/disponibilita", methods=['GET'])

def get_disponibilita_medico(medico_id):

    try:
        slots_disponibili = Disponibilita.query.filter_by(

            medico_id=medico_id, 

            è_prenotato=False

        ).all()

        lista_slot_json = []

        for slot in slots_disponibili:

            lista_slot_json.append({

                "id": slot.id,

                "data_inizio": slot.data_inizio.isoformat(),

                "data_fine": slot.data_fine.isoformat()

            })

        

        return jsonify(lista_slot_json)



    except Exception as e:

        return jsonify({"errore": f"Errore del server: {str(e)}"}), 500

@app.route("/api/appuntamenti", methods=['GET'])

@jwt_required()

def get_miei_appuntamenti():

    current_user_id = get_jwt_identity()

    

    try:

        appuntamenti = Appuntamento.query.filter_by(paziente_id=current_user_id).all()

        

        lista_appuntamenti_json = []

        for appuntamento in appuntamenti:

            medico = appuntamento.slot_disponibile.medico

            lista_appuntamenti_json.append({

                "id": appuntamento.id,

                "data_prenotazione": appuntamento.data_prenotazione.isoformat(),

                "stato": appuntamento.stato,

                "slot": {

                    "data_inizio": appuntamento.slot_disponibile.data_inizio.isoformat(),

                    "data_fine": appuntamento.slot_disponibile.data_fine.isoformat(),

                },

                "medico": {

                    "nome_completo": medico.nome_completo,

                    "specializzazione": medico.specializzazione

                }

            })

        return jsonify(lista_appuntamenti_json)



    except Exception as e:

        return jsonify({"errore": f"Errore del server: {str(e)}"}), 500





@app.route("/api/appuntamenti", methods=['POST'])

@jwt_required()

def prenota_appuntamento():

    current_user_id = get_jwt_identity()

    data = request.get_json()

    disponibilita_id = data.get('disponibilita_id')

    if not disponibilita_id:

        return jsonify({"errore": "ID della disponibilità mancante"}), 400

    try:

        slot = Disponibilita.query.get(disponibilita_id)

        if not slot:

            return jsonify({"errore": "Slot di disponibilità non trovato"}), 404

        

        if slot.è_prenotato:

            return jsonify({"errore": "Questo slot è già stato prenotato"}), 409



        # Crea il nuovo appuntamento

        nuovo_appuntamento = Appuntamento(

            paziente_id=current_user_id,

            disponibilita_id=disponibilita_id

        )

        

        # Segna lo slot come prenotato

        slot.è_prenotato = True



        db.session.add(nuovo_appuntamento)

        db.session.commit()



        return jsonify({

            "messaggio": "Appuntamento prenotato con successo!",

            "appuntamento_id": nuovo_appuntamento.id

        }), 201



    except Exception as e:

        db.session.rollback()

        return jsonify({"errore": f"Errore del database: {str(e)}"}), 500



# --- Funzione di Seed per il Database (da eseguire una sola volta) ---



def seed_database():

    """Popola il database con dati di esempio se è vuoto."""

    with app.app_context():

        # Controlla se ci sono già medici

        if Medico.query.count() > 0:

            print("Database già popolato. Salto il seeding.")

            return

        print("Popolamento del database con dati di esempio...")

        # 1. Creazione di alcuni medici di esempio
        medico1 = Medico(nome_completo="Dott. Mario Rossi", specializzazione="Cardiologia", descrizione="Esperto in cardiologia clinica e interventistica.")

        medico2 = Medico(nome_completo="Dott.ssa Anna Bianchi", specializzazione="Dermatologia", descrizione="Specializzata in dermatologia estetica e mappatura nevi.")

        medico3 = Medico(nome_completo="Dott. Luca Verdi", specializzazione="Ortopedia", descrizione="Focus su chirurgia del ginocchio e anca.")

        db.session.add_all([medico1, medico2, medico3])

        db.session.commit()

        # 2. Creazione di slot di disponibilità per i medici
        today = datetime.date.today()

        # Slot per il Dott. Rossi
        for i in range(3):

            giorno = today + datetime.timedelta(days=i + 1)

            db.session.add(Disponibilita(medico_id=medico1.id, data_inizio=datetime.datetime(giorno.year, giorno.month, giorno.day, 9, 0), data_fine=datetime.datetime(giorno.year, giorno.month, giorno.day, 9, 30)))

            db.session.add(Disponibilita(medico_id=medico1.id, data_inizio=datetime.datetime(giorno.year, giorno.month, giorno.day, 10, 0), data_fine=datetime.datetime(giorno.year, giorno.month, giorno.day, 10, 30)))

        # Slot per la Dott.ssa Bianchi
        for i in range(2):

            giorno = today + datetime.timedelta(days=i + 2)

            db.session.add(Disponibilita(medico_id=medico2.id, data_inizio=datetime.datetime(giorno.year, giorno.month, giorno.day, 14, 0), data_fine=datetime.datetime(giorno.year, giorno.month, giorno.day, 14, 20)))

            db.session.add(Disponibilita(medico_id=medico2.id, data_inizio=datetime.datetime(giorno.year, giorno.month, giorno.day, 15, 0), data_fine=datetime.datetime(giorno.year, giorno.month, giorno.day, 15, 20)))



        db.session.commit()

        print("Database popolato con successo!")





# --- Blocco di Esecuzione ---



if __name__ == '__main__':

    with app.app_context():

        db.create_all()  # Crea le tabelle se non esistono

        seed_database()  # Popola il DB con dati di esempio

    

    app.run(debug=True, port=5000)
