import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Pour charger les variables d'environnement

// Ici on va se co à la DB avec l'RUI dans .env
mongoose.connect(process.env.MONGO_URI, {})
.then(()=> console.log('Je suis bien connected'))
.catch(err => console.error('Les problèèèmes :', err));

// Défintion du Schéma Person :
// Le schéma définit la strucutre du document dans une collection 
const personSchema = new mongoose.Schema({
    name: { type: String, required: true},
    age: Number,
    favoriteFoods: [String]
});


/* Ici on crée le model Person sur la base du Schéma.
Ca va nous permettre de MAJ SUPP etc des documents de ce type */ 
const Person = mongoose.model('Person', personSchema);

/* Ici on va créer une person et la save dans la DB*/
const CreateSavePerson = async () => {
    try {
      const person = new Person({
        name: 'Alice',
        age: 25,
        favoriteFoods: ['Pizza', 'Mloukheya'],
      });

      // On enregistre dans la DB 
      const savedPerson = await person.save(); // Utilisation d'async/await
      console.log('Saved dans la DB :', savedPerson);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
    }
  };

  CreateSavePerson();



/* Créer plusieurs personne à la fois 
avec un tableau d'objets */

const createManyPeople = async (arrayOfPeople) => {
    try {
        const people = await Person.create(arrayOfPeople);
        console.log("Les personnes créees :", people);
        return people;
    } catch (err) {
        console.error("Erreur pour:", err);
    }
};

/* Chercher les personnes by name */ 

const FindPeoplebyName =  async (personName) => {
    try {
        const foundPeople = await Person.find({ name: personName});
        console.log(`Les gens trouvés sont ${personName}`, foundPeople);
        return foundPeople
    } catch (err) {
        console.error(err);
    }
}
// Appeler la fonction pr check si c'est ok 
FindPeoplebyName("Alice");

// Trouver via quelqu'un via le plat fav
const findOneByFood = async (food) => {
    try {
        const foundPerson = await Person.findOne({ favoriteFoods: food});
        console.log(`La personne qui aime la ${food} est`, foundPerson);
        return foundPerson
    } catch (err) {
        console.error(err);
    }
}; 

findOneByFood("Pizza");

// Trouver la personne via son ID 
const FindPersonById = async (personId) => {
    try {
        const foundPerson = await Person.findById(personId);
        console.log(`La personne avec l'Id : ${personId}`, foundPerson);
        return foundPerson
    } catch (err) {
        console.error(err);
    }
};

// Find Edit et Save 

const findEditThenSave = async (personId, food) => {
    try {
        const person = await Person.findById(personId)
        if(!person) {
            console.log("Aucune personne avec cet Id");
            return null;
        }

        if (person.favoriteFoods.includes(food)) {
            console.log(`${food} est deja dans les fav`);
            return person; 
        }

        person.favoriteFoods.push(food);
        const updatedPerson = await person.save();
        console.log("Personne MAJ :", updatedPerson);
        return updatedPerson;
    } catch (err) {
        console.error(err);
    }
};

// Find and Update 

const findAndUpdate = async (personName) => {
    const ageToSet = 20;
    try {
        const updatedDoc = await Person.findOneAndUpdate(
            {name: personName},
            {age: ageToSet},
            {new: true}
        );
        console.log(`MAJ de ${personName}:`, updatedDoc);
        return updatedDoc;
    } catch (err) {
        console.error(err);
    }
};

findAndUpdate("Alice"); 

// Remove By ID

const removeById = async (personId) => {
    try {
        const removedPerson = await Person.findByIdAndDelete(personId);
        console.log("Personne qu'a tej de la liste:", removedPerson);
    } catch (err) {
        console.error(err);
    }
};
// removeById('67599973c235b47fc3a5d122');

// Supprimer plusieurs documents 

const removeManyPeople = async () => {
    try {
        const result = await Person.deleteMany({ name: "Alice"});
        console.log("Toutes les Alice ont tej. Regarde:", result);
        return result
    } catch (err) {
        console.error(err);
    }
};

// removeManyPeople();

// Query Chain

const queryChain = async () => {
    try {
        const data = await Person.find({ favoriteFoods: "Brik"})
        .sort({name: 1})
        .limit(2)
        .select("-age")
        .exec();
        console.log('resultat de la requete', data);
    } catch (err) {
        console.error(err);
    }
};
