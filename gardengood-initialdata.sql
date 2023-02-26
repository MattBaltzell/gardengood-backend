INSERT INTO seasons (name)
    VALUES
        ('Early Spring'),
        ('Spring'),
        ('Late Spring'),
        ('Early Summer'),
        ('Summer'),
        ('Late Summer'),
        ('Early Fall') ,
        ('Fall'),
        ('Late Fall'),
        ('Early Winter'),
        ('Winter'),
        ('Late Winter');

INSERT INTO sunlight (name,description)
    VALUES
        ('Full Sun', 'Full sun is six or more hours of direct sunlight per day.'),
        ('Partial Sun', 'Partial sun is between four and six hours of sun a day.'),
        ('Partial Shade', 'Partial shade is two to four hours of sun per day.'),
        ('Shade', 'Shade, in gardening terms, means less than two hours of sunlight a day.');

INSERT INTO instruction_types (name)
    VALUES
        ('planting'),
        ('pruning'),
        ('watering');