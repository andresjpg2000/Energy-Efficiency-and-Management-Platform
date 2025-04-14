from faker import Faker
from faker.providers import BaseProvider
from datetime import datetime, timedelta
import random

#Script to populate database. 
# How to use:
# 1. Run the script to generate a SQL file with INSERT statements.
# 2. Run the SQL file in your database to populate it with fake data.
# 3. Make sure to adjust the number of records generated as needed.

fake = Faker()

statements = []
codigo_postal_statements = []
inserted_cps = set()
    
class customProvider(BaseProvider):
    def pt_postal_code(self):
        first_part = str(random.randint(1000, 9999))
        second_part = str(random.randint(100, 999))
        return f"{first_part}{second_part}"
    
fake.add_provider(customProvider)

def save_sql_file(filename="populateDB.sql"):
    with open(filename, "w", encoding="utf-8") as file:
        file.write(f"-- Generated on {datetime.now()}\n")
        
        # It's important to have the table "codigo_postal" before the table "moradia"
        # because the table "moradia" has a foreign key that references the table "codigo_postal"
        for statement in codigo_postal_statements:
            file.write(statement + "\n")
        
        for statement in statements:
            file.write(statement + "\n")
    
# Populate "utilizador" table
def populate_users (num_users=10):
    for _ in range(num_users):
        nome = fake.name()
        email = fake.email()
        password = fake.password()
        statement = f"INSERT INTO utilizador (nome, email, password) VALUES ('{nome}', '{email}', '{password}');"
        statements.append(statement)

# Populate "codigo_postal" table
def populate_codigo_postal(postal_codes):
    for cp in postal_codes:
        # Only insert if the CP has not been inserted yet
        if cp not in inserted_cps:
            cp_prefix = cp[:4]  # Get the first part of the postal code (e.g., "1000")
            
            if 1000 <= int(cp_prefix) <= 1999:
                localidade = "Lisboa"
            elif 2000 <= int(cp_prefix) <= 2399:
                localidade = "Santarém"
            elif 2400 <= int(cp_prefix) < 2900:
                localidade = "Leiria"
            elif 2900 <= int(cp_prefix) <= 2999:
                localidade = "Setúbal"
            elif 3000 <= int(cp_prefix) <= 3999:
                localidade = "Coimbra"
            elif 3800 <= int(cp_prefix) <= 3899:
                localidade = "Aveiro"
            elif 4000 <= int(cp_prefix) <= 4999:
                localidade = "Porto"
            elif 4700 <= int(cp_prefix) <= 4899:
                localidade = "Braga"
            elif 5000 <= int(cp_prefix) <= 5299:
                localidade = "Vila Real"
            elif 5300 <= int(cp_prefix) <= 5999:
                localidade = "Bragança"
            elif 6000 <= int(cp_prefix) <= 6999:
                localidade = "Castelo Branco"
            elif 7000 <= int(cp_prefix) <= 7299:
                localidade = "Évora"
            elif 7300 <= int(cp_prefix) < 7800:
                localidade = "Portalegre"
            elif 7800 <= int(cp_prefix) <= 7899:
                localidade = "Beja"
            elif 8000 <= int(cp_prefix) <= 8999:
                localidade = "Faro"
            elif 9000 <= int(cp_prefix) < 10000:
                localidade = "Madeira"
            elif 6300 <= int(cp_prefix) <= 6399:
                localidade = "Guarda"
            else:
                localidade = "Desconhecido"  # In case the CP prefix doesn't match known ranges

            statement = f"INSERT INTO codigo_postal (cp, localidade) VALUES ('{cp}', '{localidade}');"
            codigo_postal_statements.append(statement)
            inserted_cps.add(cp)  # Mark this CP as inserted

# Populate "moradia" table
def populate_moradia(num_moradias=10):
    # Change to match users_id in data base
    for user_id in range(2, num_moradias + 1):
        id_consumidor = user_id
        address = fake.address()
        cp = fake.pt_postal_code()
        populate_codigo_postal([cp])
        tipo_construcao = random.choice(['Apartamento', 'Moradia', 'Estúdio'])
        statement = f"INSERT INTO moradia (Morada, CP, Tipo_Construção, id_consumidor) VALUES ('{address}', '{cp}', '{tipo_construcao}', '{id_consumidor}');"
        statements.append(statement)

def populate_equipamento_energetico(num_equipamentos=10):
    for equipamento in range(1, num_equipamentos + 1):
        id_moradia = equipamento
        tipo_energia = random.randint(1, 6)
        
        if tipo_energia == 1:
            nome = "Painel Solar Fotovoltaico"
            capacidade = random.randint(2, 10)
        elif tipo_energia == 2:
            nome = "Painel Solar Térmico"
            capacidade = random.randint(3, 7)
        elif tipo_energia == 3:
            nome = "Biomassa"
            capacidade = random.randint(10, 50)
        elif tipo_energia == 4:
            nome = "Energia Eólica"
            capacidade = random.randint(1, 20)
        elif tipo_energia == 5:
            nome = "Energia Geotérmica"
            capacidade = random.randint(3, 15)
        else:
            nome = fake.name()
            
        statement = f"INSERT INTO equipamento_energetico (tipo_energia, Capacidade, moradia, nome) VALUES ('{tipo_energia}', '{capacidade}', '{id_moradia}', '{nome}');"
        statements.append(statement)

# Run it
# Remember to change the methods being called and their parameters
if __name__ == "__main__":
    # populate_users()
    populate_moradia(14)
    populate_equipamento_energetico(14)
    save_sql_file()