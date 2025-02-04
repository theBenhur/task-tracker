#!/usr/bin/env node
const [, , action, ...arguments] = process.argv
const { addTodo, listTodo, deleteTodo, updateTodo, markStatus } = require("./utils")

const opts = {
    'add': (arguments) => addTodo(arguments),
    'delete': (id) => deleteTodo(id),
    'list': (args) => listTodo(args),
    'update': (arguments) => updateTodo(arguments),
    'mark-in-progress':(args)=>markStatus(args,0),
    'mark-done':(args)=>markStatus(args,1),
}

if (opts.hasOwnProperty(action)) {
    opts[action](arguments)
} else console.log("That opt is not valid")