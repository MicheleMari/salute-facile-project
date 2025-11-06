# backend/seed.py

import datetime
from app import app, db, Medico, Disponibilita, Utente, Appuntamento, bcrypt

# --- DATI DEI MEDICI ---
medici_data = [
    {
        "nome_completo": "Dott. Mario Rossi",
        "specializzazione": "Cardiologia",
        "descrizione": "Esperto in cardiologia preventiva e cura delle aritmie.",
        "foto_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "linkedin_url": "https://linkedin.com/in/mario-rossi-example",
        "sito_web_url": "https://mario-rossi-cardiologia.example.com"
    },
    {
        "nome_completo": "Dott.ssa Laura Bianchi",
        "specializzazione": "Dermatologia",
        "descrizione": "Specializzata in dermatologia clinica ed estetica, mappatura nevi.",
        "foto_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "linkedin_url": "https://linkedin.com/in/laura-bianchi-example",
        "sito_web_url": None
    },
    {
        "nome_completo": "Dott. Luca Verdi",
        "specializzazione": "Ortopedia",
        "descrizione": "Trattamento di patologie della spalla e del ginocchio. Chirurgia artroscopica.",
        "foto_url": "https://images.unsplash.com/photo-1622253692010-333f2da60710?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "linkedin_url": None,
        "sito_web_url": "https://luca-verdi-ortopedia.example.com"
    },
    {
        "nome_completo": "Dott.ssa Anna Neri",
        "specializzazione": "Pediatria",
        "descrizione": "Pediatra di famiglia, con focus su nutrizione e sviluppo neonatale.",
        "foto_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "linkedin_url": "https://linkedin.com/in/anna-neri-example",
        "sito_web_url": None
    },
    {
        "nome_completo": "Dott. Marco Gialli",
        "specializzazione": "Fisioterapia",
        "descrizione": "Riabilitazione post-operatoria e trattamento di lesioni sportive.",
        "foto_url": None, # Esempio senza foto
        "linkedin_url": "https://linkedin.com/in/marco-gialli-example",
        "sito_web_url": "https://fisioterapia-gialli.example.com"
    },
    {
        "nome_completo": "Dott.ssa Elisa Boni",
        "specializzazione": "Ginecologia",
        "descrizione": "Visite specialistiche, ecografie e consulenza per la fertilità.",
        "foto_url": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "linkedin_url": None,
        "sito_web_url": None
    }
]

# --- DATI UTENTE DI PROVA ---
# Creiamo un utente paziente di prova per futuri test di login
# Email: michelemari@test.com
# Password: Ciao
utente_test_data = {
    "email": "michelemari@test.com",
    "password": "Ciao",
    "nome": "Michele",
    "cognome": "Mari"
}

def seed_database():
    """ Funzione per popolare il database con dati estesi """
    
    with app.app_context():
        # Elimina tutte le tabelle esistenti e le ricrea con lo schema aggiornato.
        # Questo risolve gli errori "no such column" quando si modifica il modello.
        print("Ricostruzione del database...")
        db.drop_all()
        db.create_all()
        db.session.commit()

        # --- Crea Utente di Prova ---
        print("Creazione utente di prova...")
        hashed_password = bcrypt.generate_password_hash(utente_test_data["password"]).decode('utf-8')
        utente_prova = Utente(
            email=utente_test_data["email"],
            password_hash=hashed_password,
            nome=utente_test_data["nome"],
            cognome=utente_test_data["cognome"],
            ruolo='paziente'
        )
        db.session.add(utente_prova)
        db.session.commit()
        print(f"Creato utente: {utente_prova.email}")

        # --- Crea Medici ---
        print("Creazione Medici...")
        medici_creati = []
        for data in medici_data:
            medico = Medico(
                nome_completo=data["nome_completo"],
                specializzazione=data["specializzazione"],
                descrizione=data["descrizione"],
                foto_url=data.get("foto_url"),
                linkedin_url=data.get("linkedin_url"),
                sito_web_url=data.get("sito_web_url")
            )
            db.session.add(medico)
            medici_creati.append(medico)
        
        db.session.commit()
        print(f"Creati {len(medici_creati)} medici.")

        # --- Aggiungi disponibilità ---
        print("Creazione disponibilità...")
        
        medico_rossi = Medico.query.filter_by(specializzazione="Cardiologia").first()
        medico_bianchi = Medico.query.filter_by(specializzazione="Dermatologia").first()
        medico_verdi = Medico.query.filter_by(specializzazione="Ortopedia").first()
        
        oggi = datetime.date.today()
        
        # Slot per Dott. Rossi (Cardiologia)
        slot_rossi = [
            { "delta_giorni": 1, "ora": 9, "minuti": 0 },
            { "delta_giorni": 1, "ora": 9, "minuti": 30 },
            { "delta_giorni": 1, "ora": 10, "minuti": 0 },
            { "delta_giorni": 2, "ora": 14, "minuti": 0 },
            { "delta_giorni": 2, "ora": 14, "minuti": 30 },
        ]
        
        # Slot per Dott.ssa Bianchi (Dermatologia)
        slot_bianchi = [
            { "delta_giorni": 1, "ora": 15, "minuti": 0 },
            { "delta_giorni": 1, "ora": 15, "minuti": 30 },
            { "delta_giorni": 3, "ora": 10, "minuti": 0 },
        ]
        
        # Slot per Dott. Verdi (Ortopedia)
        slot_verdi = [
            { "delta_giorni": 2, "ora": 9, "minuti": 0 },
            { "delta_giorni": 2, "ora": 9, "minuti": 30 },
        ]

        def aggiungi_slot(medico, lista_slot):
            """ Funzione helper per aggiungere slot a un medico """
            count = 0
            for slot in lista_slot:
                data_slot = oggi + datetime.timedelta(days=slot["delta_giorni"])
                data_inizio = datetime.datetime(
                    data_slot.year, data_slot.month, data_slot.day, 
                    slot["ora"], slot["minuti"]
                )
                data_fine = data_inizio + datetime.timedelta(minutes=30)
                
                nuova_disponibilita = Disponibilita(
                    data_inizio=data_inizio,
                    data_fine=data_fine,
                    è_prenotato=False,
                    medico_id=medico.id
                )
                db.session.add(nuova_disponibilita)
                count += 1
            return count

        # Aggiungi fisicamente gli slot
        count_rossi = aggiungi_slot(medico_rossi, slot_rossi)
        count_bianchi = aggiungi_slot(medico_bianchi, slot_bianchi)
        count_verdi = aggiungi_slot(medico_verdi, slot_verdi)
        
        db.session.commit()
        
        print(f"Creati {count_rossi} slot per {medico_rossi.nome_completo}.")
        print(f"Creati {count_bianchi} slot per {medico_bianchi.nome_completo}.")
        print(f"Creati {count_verdi} slot per {medico_verdi.nome_completo}.")
        print("\nDatabase popolato con successo!")

# Esegui la funzione
if __name__ == '__main__':
    seed_database()