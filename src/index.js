const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

function validateCourseId(req, res, next) {
    const { id } = req.params;

    const validateId = isUuid(id);

    if (validateId) {
        next();
    } else {
        return res.status(400).json({ error: 'Course Id is not valid' })
    }
}

app.use('projects/:id', validateCourseId);

const courses = [];

app.get('/courses', (req, res) => {
    return res.json(courses);
});
 
app.post('/courses', (req, res) => {
    const { owner, course_name } = req.body
    
    if (!owner || !course_name) {
        return res.json({ error: 'Digite todos os campos!' });
    }

    const newCourse = { id: uuid(), owner, course_name }   

    courses.push(newCourse);

    return res.json(newCourse);
});

app.put('/courses/:id', (req, res) => {
    const { id } = req.params
    const { course_name } = req.body
    const { owner } = req.body

    /**
     * Encontrando a posição no Array de algum curso que tenha o mesmo id
     * que foi passado no req.params
     */ 

    const courseIndex = courses.findIndex(course => course.id === id); 

    if (courseIndex < 0) {
        return res.status(400).json({ error: 'Course ID not found' });
    }

    const course = { id, course_name, owner }

    /**
     * Encontrando o curso que está com a posição no Array
     * e atualizando as informações com as que o usuário 
     * passa no req.body
     */
    courses[courseIndex] = course;


    return res.json(course);
});

app.delete('/courses/:id', (req, res) => {
    const { id } = req.params

    /**
     * Encontrando a posição no Array de algum curso que tenha o mesmo id
     * que foi passado no req.params
     */ 
    const courseIndex = courses.findIndex(course => course.id === id);

    if (courseIndex < 0) {
        return res.status(400).json({ error: 'Course ID not found' });
    }

    courses.splice(courseIndex, 1);

    return res.status(204).send();
});

app.listen(3333, () => {
    console.log(`✅ Back-end running`)
});