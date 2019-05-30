//Zwraca z local storage obiekt o kluczu "todos", jeśli local storage jest pusty, zwraca pustą tablicę
const getSavedTodos = function() {
    const todosJSON = localStorage.getItem('todos')
    if (todosJSON !== null) {
        return JSON.parse(todosJSON)
    } else {
        return []
    }
}

const saveTodos = function(todos) {//Konwertuje obiekty w tablicy do formatru JSON i zapisuje je w local storage
    localStorage.setItem('todos', JSON.stringify(todos))
}

const removeTodo = function(id) {
    const todoIndex = todos.findIndex(function(todo) {//Iteruje przez całą tablicę "todos" i zwraca indeks todo, które spełniło warunek, jeśli żadne todo nie spełniło warunku zwraca -1
        return todo.id === id//Zwraca indeks todo, którego id jest równe id todo wywołanego przez kliknięcie w removeButton z event listenerem(patrz removeButton.addEventListener poniżej)
    })
    if(todoIndex > -1) {
        todos.splice(todoIndex, 1)//Usuwa todo, które spełniło powyższy warunek. Pierwszy argument to id todo, drugi ilość elementów do usunięcia.
    }
}


const toggleTodo = function(id) {
    const todo = todos.find(function(todo) {//Iteruje przez tablicę "todos"
        return todo.id === id//Zwraca konkretne todo, którego id jest równe id wywołanemu przez event listener poniżej (checkbox.addEventListener w funckji generateTodoDOM) i zapisuje jest w const todo. Jeśli żadne todo nie spełnia warunuku, to const todo = undefined
    })

    if(todo !== undefined) {
        todo.completed = !todo.completed//Odwraca wartość klucza completed (jeśli wartość to true ustawia nową wartość na false, jeśli wartośc to false ustawia nową wartość na true)
    }
}

//Renderuje tablice na podstawie filtrów
const renderTodos = function(todos, filters) {
    let filteredTodos = todos.filter(function(todo) { 
        return todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
    })//Filtruje elementy oryginalnej tablicy, które w kluczu "text" zawierają tekst z klucza "searchText" z obiektu "filters"
    filteredTodos = filteredTodos.filter(function(todo) {
        return !filters.hideCompleted || !todo.completed//Filtruje filteredTodos i zwraca tylko te, dla których wartość completed to false (o ile filtr hideCompleted ma wartość true, jeśli jest false zwraca całe filteredNotes)
    })

    const incompleteTodos = filteredTodos.filter(function(todo) {
        return !todo.completed
    })//Zwraca tablicę obiektów, które w kluczu "completed" mają wartość false

    document.querySelector('#todos').innerHTML = ''//Czyści cały div id=todos przed renderowaniem, żeby elementy się nie powielały
    document.querySelector('#todos').appendChild(getSummaryDOM(incompleteTodos))//Tworzy w div id=todos heading z informacją o ilości elementów, których klucz "completed" ma wartość "false"
    
    filteredTodos.forEach(function(todo) {
        document.querySelector('#todos').appendChild(generateTodoDOM(todo))
    })//Iteruje przez wszystkie wyfiltorwane elementy i tworzy ich html w div id=todos
}

//Generuje DOM dla każdego elementu
const generateTodoDOM = function(todo) {
    const todoEl = document.createElement('div')
    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.checked = todo.completed//Ustawia wartość dla checked na podstawie wartości klucza "completed". Jeśli "completed" dla konkretego todo jest ustawione na true, checkbox będzie automatycznie zaznaczony
    const todoText = document.createElement('span')
    todoText.textContent = todo.text
    const removeButton = document.createElement('button')
    removeButton.textContent = 'x'
    todoEl.appendChild(checkbox)
    checkbox.addEventListener('change', function(e) {
        toggleTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters)
    })
    todoEl.appendChild(todoText)
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', function(e) {
        //W tym miejscu jest już dostęp do indywidualnego id każdego todo. Każdy button odpowiada todo, z którym jest w divie
        removeTodo(todo.id)//Podtsawia do funkcji removeTodo id konkretnego todo
        saveTodos(todos)//Zapisuje tablicę w local storage już bez usuniętego todo
        renderTodos(todos, filters)//Renderuje DOM po każdym usunięciu todo
    })
    return todoEl
}

//Generuje heading z informacją o liczbie elementów z wartościa "false" w kluczu "completed"
const getSummaryDOM = function(incompleteTodos) {
    const summary = document.createElement('h2')
    summary.textContent = `You have ${incompleteTodos.length} todos left`
    return summary
}