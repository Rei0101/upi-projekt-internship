1. Instalirajte PostgreSQL

2. Tijekom instalacije postavite lozinku "internship" ili je promjenite sa naredbom u SQL-u (ALTER USER postgres WITH PASSWORD 'internship';)

3. Nakon instalacije otvorite pgAdmin4.

4. Kreirajte novi database, ime moze biti bilo koje ali je poželjno za sada da bude isto kao i datoteka 'ScheduleIT-DB'

Sada imaju dva način za učitavanje ove baze

5.1 Desni klik na kreiranu bazu --> Restore... --> Odaberete file "ScheduleIT-DB.sql" iz datoteke baze
						
						ili

5.2 Desni klik na kreiranu bazu --> Query Tool --> Copy paste podatke iz fileova "ScheduleIT-DB SQL kod" i "mock unosi"


6. Provjerite dali su učitane tablice (ime_baze --> Schemas --> public --> Tables)
