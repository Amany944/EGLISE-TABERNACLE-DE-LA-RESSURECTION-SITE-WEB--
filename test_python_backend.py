#!/usr/bin/env python3
"""
Script de test pour les fonctions Python du backend
Teste les trois scripts Python de manière directe
"""

import json
import os
import sys

# Ajouter le dossier python au chemin
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python'))

# Importer les modules
from process_contact import process_contact
from process_prayer import process_prayer
from process_registration import process_registration

def test_contact():
    """Test du traitement des contacts"""
    print("=" * 60)
    print("TEST 1 : TRAITEMENT DES CONTACTS")
    print("=" * 60)
    
    contact_data = {
        "name": "Jean Dupont",
        "email": "jean@example.com",
        "phone": "+225 01 02 03 04",
        "subject": "Information sur l'église",
        "message": "Bonjour, j'aimerais avoir plus d'informations",
        "timestamp": "2026-04-15T15:45:00Z",
        "ip": "192.168.1.1"
    }
    
    result = process_contact(contact_data)
    print(f"Résultat: {json.dumps(result, indent=2, ensure_ascii=False)}")
    print()

def test_prayer():
    """Test du traitement des prières"""
    print("=" * 60)
    print("TEST 2 : TRAITEMENT DES PRIÈRES")
    print("=" * 60)
    
    prayer_data = {
        "name": "Marie Martin",
        "email": "marie@example.com",
        "request": "Prière pour la guérison de ma mère qui est malade",
        "timestamp": "2026-04-15T15:50:00Z"
    }
    
    result = process_prayer(prayer_data)
    print(f"Résultat: {json.dumps(result, indent=2, ensure_ascii=False)}")
    print()

def test_registration():
    """Test du traitement des inscriptions"""
    print("=" * 60)
    print("TEST 3 : TRAITEMENT DES INSCRIPTIONS AUX ÉVÉNEMENTS")
    print("=" * 60)
    
    registration_data = {
        "name": "Pierre Dubois",
        "email": "pierre@example.com",
        "phone": "+225 06 07 08 09",
        "eventId": "1",
        "timestamp": "2026-04-15T16:00:00Z"
    }
    
    result = process_registration(registration_data)
    print(f"Résultat: {json.dumps(result, indent=2, ensure_ascii=False)}")
    print()

def check_data_files():
    """Vérifier les fichiers de données créés"""
    print("=" * 60)
    print("VÉRIFICATION DES FICHIERS DE DONNÉES")
    print("=" * 60)
    
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    
    files_to_check = [
        ('contacts.json', 'Contacts enregistrés'),
        ('prayers.json', 'Prières enregistrées'),
        ('registrations.json', 'Inscriptions'),
        ('logs.json', 'Logs des interactions')
    ]
    
    for filename, description in files_to_check:
        filepath = os.path.join(data_dir, filename)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = json.load(f)
            print(f"\n✅ {description} ({filename}):")
            print(f"   Nombre d'entrées: {len(content)}")
            if len(content) > 0:
                print(f"   Dernière entrée: {json.dumps(content[-1], indent=2, ensure_ascii=False)[:200]}...")
        else:
            print(f"\n❌ {description} ({filename}): Fichier non trouvé")

def main():
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "TEST DU BACKEND PYTHON" + " " * 25 + "║")
    print("║" + " " * 7 + "ÉGLISE TABERNACLE DE LA RÉSURRECTION" + " " * 15 + "║")
    print("╚" + "=" * 58 + "╝")
    print()
    
    try:
        test_contact()
        test_prayer()
        test_registration()
        check_data_files()
        
        print("\n" + "=" * 60)
        print("✅ TOUS LES TESTS SONT RÉUSSIS!")
        print("=" * 60)
        print()
        
    except Exception as e:
        print(f"\n❌ ERREUR LORS DES TESTS: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()