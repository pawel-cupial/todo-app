const todos = getSavedTodos()//Zwraca dane z funckji getSavedTodos(dane z local storage albo pustą tablicę)

const filters = {
    searchText: '',
    hideCompleted: false
}

renderTodos(todos, filters)//Pierwotne renderowanie. Bez tego wezwania do czasu wpisania czegokolwiek w inpucie na stronie nie pojawiałyby się żadne elementy.

document.querySelector('#search-text').addEventListener('input', (e) => {
    filters.searchText = e.target.value//Zapisuje wartość z input id=search-text jako searchText w obieckie filters
    renderTodos(todos, filters)//Renderuje elementy po każdej zmianie w inpucie
})

document.querySelector('#new-todo').addEventListener('submit', (e) => {
    const text = e.target.elements.text.value.trim()//Przez .elements uzyskuję dostęp do wszystkich elementów należących do formularza #new-todo po atrybucie "name"
    e.preventDefault()//Zapobiega domyślnemu zachowaniu formularza (domyślnie przeładowuje stronę i dobija tekst z submitu do adresu URL)
    
    if(text.length > 0) {
        todos.push(
            {id: uuidv4(),
            text: text, 
            completed: false})//Dodaje nowy element do tablicy todos. Elements.text.value wstawia do klucza text to, co użytkownik submitował przez input o atrybucie name="text"
        saveTodos(todos)//Zaspisuje tablicę todos w local storage w formacie JSON
        renderTodos(todos, filters)//Renderuje elementy po każdym submicie
        e.target.elements.text.value = ''//Czyści input po każdym submicie
    } 
})

document.querySelector('#hide-completed').addEventListener('change', (e) => {
    filters.hideCompleted = e.target.checked//.checked zwraca true jeśli checbox jest zaznaczony i false jeśli nie jest. Ten kod aktualizauje klucz hideCompleted w obiekcie filters w zależności od wartości .checked
    renderTodos(todos, filters)//Renderuje elementy po każdej zmianie w checkboxie
})