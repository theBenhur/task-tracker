const fs = require("fs")
const { FILENAME, STATUS } = require('./constants')

function checkArgumentsCount(spected, given) {
    const goAhead = spected === given.length
    if (!goAhead)
        console.log("Wrong parameters number")
    return goAhead
}
function addTodo(description) {
    if (!checkArgumentsCount(1, arguments)) return
    [todoDescription,] = description
    let tasks = getDataFromFile()
    nextId = tasks.tasks.length
    while (tasks.tasks.filter(t => t.id === nextId).length) { nextId++ }
    tasks.tasks.push({
        "id": nextId,
        "description": todoDescription,
        "status": "todo",
        "createdAt": new Date().toUTCString().split('T')[0],
        "updatedAt": undefined
    })
    writeOnFile(tasks)
}
function writeOnFile(tasks) {
    fs.writeFileSync(FILENAME, JSON.stringify(tasks))
}

function deleteTodo(id) {
    if (!checkArgumentsCount(1, arguments))
        return
    [id,] = id.map(e => Number.parseInt(e))
    let tasks = getDataFromFile()
    if (tasks.tasks.filter(t => id === t.id).length) {
        tasks.tasks = tasks.tasks.filter(t => id !== t.id)
        writeOnFile(tasks)
    }
    else
        console.log("There is not any task with that id")
}

function listTodo(status) {
    status = status[0]
    if (!Object.values(STATUS).includes(status) && status !== undefined) {
        console.log("That is not a valid status")
        return
    }

    const tasks = getDataFromFile()
    if (tasks.tasks.length === 0) {
        console.log("There is not any todo :)")
        return
    }

    if (status === undefined)
        for (let task of tasks.tasks)
            console.log("id: ", task.id, " description: ", task.description, " status: ", task.status, "created at:", task.createdAt, "updated at:", task.updatedAt)
    else
        for (let task of tasks.tasks.filter(task => task.status === status))
            console.log("id: ", task.id, " description: ", task.description, " status: ", task.status, task.createdAt, "updated at:", task.updatedAt)
}

function getDataFromFile() {
    let tasks
    try {
        const fd = fs.readFileSync(FILENAME, 'utf-8')
        tasks = JSON.parse(fd)
    }
    catch (e) {
        tasks = {
            "tasks": []
        }
    }
    return tasks
}

function markStatus(id, status) {
    let tasks = getDataFromFile()
    const ids = id.map(e => Number.parseInt(e))
    const updatedStatus = STATUS[Object.keys(STATUS)[status]]
    for (let i of ids) {
        for (let j = 0; j < tasks.tasks.length; j++) {
            if (tasks.tasks[j].id === i) {
                tasks.tasks[j].status = updatedStatus
            }
        }
    }
    writeOnFile(tasks)
}

function updateTodo(args) {
    let [id, description] = args
    id = Number.parseInt(id)
    tasks = getDataFromFile()

    let taskExists = false
    for (let i = 0; i < tasks.tasks.length; i++) {
        if (tasks.tasks[i].id === id) {
            taskExists = true
            tasks.tasks[i].description = description
            tasks.tasks[i].updatedAt = new Date().toUTCString()
        }
    }
    if (!taskExists) {
        console.log("There is not any todo with that id")
        return
    }
    writeOnFile(tasks)
}

module.exports = {
    addTodo,
    deleteTodo,
    listTodo,
    updateTodo,
    markStatus
}