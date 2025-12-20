-- PostgreSQL用のDML

INSERT INTO users (email, last_name, first_name, gender, date_of_birth, location) 
VALUES 
('john.doe@example.com', 'Doe', 'John', 'Male', '1985-05-15', 'New York, USA');

INSERT INTO users (email, last_name, first_name, gender, date_of_birth, location) 
VALUES 
('jane.smith@example.com', 'Smith', 'Jane', 'Female', '1990-09-21', 'Los Angeles, USA');

INSERT INTO users (email, last_name, first_name, gender, date_of_birth, location) 
VALUES 
('alex.jones@example.com', 'Jones', 'Alex', 'Non-binary', '1995-12-03', 'Chicago, USA');

INSERT INTO destinations (name, image_filename) 
VALUES 
('バリ島', 'bali-beach-sunset.png'),
('パリ', 'eiffel-tower-paris.png'),
('モルディブ', 'maldives-overwater-bungalows.png'),
('京都', 'kyoto-temple-cherry-blossoms.png'),
('サントリーニ', 'santorini-white-blue.png'),
('ドバイ', 'dubai-burj-khalifa-skyline.jpg');

