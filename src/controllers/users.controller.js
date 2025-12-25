const users = [
    {
        name:"juan"
    }
];


export const getUsers = (req, res) => {
res.json(users);
};


export const getUserById = (req, res) => {
const { id } = req.params;


const user = users.find(u => u.id === id);


if (!user) {
return res.status(404).json({ message: 'Usuario no encontrado' });
}


res.json(user);
};


export const createUser = (req, res) => {
const { name, email } = req.body;


const newUser = {
id: crypto.randomUUID(),
name,
email
};


users.push(newUser);


res.status(201).json(newUser);
};