class FifteenTheGame {
    empty;
    allGameRows;
    allDraggableElements;
    empty;
    draggedElement;
    draggedElementParent;
    currentRowIndex;
    allCurrentRowGridItems;
    currentEmptyIndex;
    // relative elements
    allRelativeElements;
    relativeTop;
    relativeBottom;
    relativeLeft;
    relativeRight;


    constructor(
        empty,
        draggedElement,
        draggedElementParent,
        currentRowIndex,
        allCurrentRowGridItems,
        currentEmptyIndex,
        allRelativeElements,
        relativeTop,
        relativeBottom,
        relativeLeft,
        relativeRight
        ) {
        this.empty = empty;
        this.draggedElement = draggedElement;
        this.draggedElementParent = draggedElementParent;
        this.currentRowIndex = currentRowIndex;
        this.allCurrentRowGridItems = allCurrentRowGridItems;
        this.currentEmptyIndex = currentEmptyIndex;
        // relative elements
        this.allRelativeElements = allRelativeElements;
        this.relativeTop = relativeTop;
        this.relativeBottom = relativeBottom;
        this.relativeLeft = relativeLeft;
        this.relativeRight = relativeRight;
        this.allGameRows = document.querySelectorAll('.pietnastka-grid__row');
        empty = document.querySelector('.pietnastka-grid__item.empty');

        this.allDraggableElements = document.querySelectorAll('.pietnastka-grid__number.jsDraggable');
        Array.from(this.allDraggableElements).forEach(item => {
            item.addEventListener('dragstart', this.boundDragStart, false);
            item.addEventListener('dragend', this.boundDragEnd, false);
            
        });

        this.empty = document.querySelector('.pietnastka-grid__item.empty');
        this.addListenersToEmpty();


    }


    dragStart(event) {
        console.log(event);
        event.target.classList.add('hold');
        this.draggedElement = event.target;
        this.draggedElementParent = event.target.parentElement;
        setTimeout(() => event.target.classList.add('invisible'), 0);
    }
    boundDragStart = this.dragStart.bind(this);

    dragEnd(event) {
        console.log('event dragend został wywołany!');
        event.target.classList.remove('invisible');
    }
    boundDragEnd = this.dragEnd.bind(this);

    dragOver(event) {
        event.preventDefault();
    }
    boundDragOver = this.dragOver.bind(this);

    dragEnter(event) {
        event.preventDefault();
        event.target.classList.add('hovered');
    }
    boundDragEnter = this.dragEnter.bind(this);

    removeClassOnDragLeave(event) {
        event.target.classList.remove('hovered');
    }
    boundRemoveClassOnDragLeave = this.removeClassOnDragLeave.bind(this);

    addListenersToEmpty() {
        this.empty.addEventListener('dragover', this.boundDragOver, false);
        this.empty.addEventListener('dragenter', this.boundDragEnter, false);
        this.empty.addEventListener('dragleave', this.boundRemoveClassOnDragLeave, false);
        this.empty.addEventListener('drop', this.boundDropHandler, false);
    }


    removeListenersFromEmpty() {
        this.empty.removeEventListener('dragover', this.boundDragOver);
        this.empty.removeEventListener('dragenter', this.boundDragEnter);
        this.empty.removeEventListener('dragleave',this.boundRemoveClassOnDragLeave);
        this.empty.removeEventListener('drop',  this.boundDropHandler);
    }

    dropHandler(event) {
        // 1. usuwana jest klasa 'empty' z elementu pierwotnie zawierającego klasę 'empty'
        this.empty.classList.remove('empty');
        this.removeListenersFromEmpty();
        // 2. dodawana jest klasa empty do rodzica elementu który wywołał wykonanie eventu
        this.empty = this.draggedElementParent;

        this.empty.classList.add('empty');
        // 2. Z elementów zawieracjących klasę jsDraggable usuwane są EventListener 'dragstart' z pomocą removeEventListener
        this.allDraggableElements.forEach(item => {
            item.removeEventListener('dragstart', this.boundDragStart);
        });
        // 3. Z elementów zawierających klasę jsDraggable usuwana jest klasa jsDraggable i ustawiany jest atrybut draggable na false
        this.allDraggableElements = document.querySelectorAll('.pietnastka-grid__number.jsDraggable');
        this.allDraggableElements.forEach(item => {
            item.classList.remove('jsDraggable');
            item.setAttribute('draggable', false);
        });
        // 4. kalkulowane są elementy do kórych mają być dodane klasy jsDraggable, EventListenery oraz atrybuty draggable=true
        this.currentRowIndex = Array.from(this.allGameRows).indexOf(this.empty.parentNode);
        this.allCurrentRowGridItems = this.allGameRows[this.currentRowIndex].querySelectorAll('.pietnastka-grid__item');
        this.currentEmptyIndex = Array.from(this.allCurrentRowGridItems).indexOf(this.empty) + 1;
        this.allRelativeElements = [];
        this.relativeTop = this.allGameRows[this.currentRowIndex-1] ? this.allGameRows[this.currentRowIndex-1].querySelector('.pietnastka-grid__item:nth-child('+this.currentEmptyIndex+')') : null;
        this.relativeBottom = this.allGameRows[this.currentRowIndex+1] ? this.allGameRows[this.currentRowIndex+1].querySelector('.pietnastka-grid__item:nth-child('+this.currentEmptyIndex+')') : null;
        this.relativeLeft = this.allGameRows[this.currentRowIndex].querySelector('.pietnastka-grid__item:nth-child('+(this.currentEmptyIndex-1)+')');
        this.relativeRight = this.allGameRows[this.currentRowIndex].querySelector('.pietnastka-grid__item:nth-child('+(this.currentEmptyIndex+1)+')');
        this.allRelativeElements = this.allRelativeElements.concat(this.relativeTop,this.relativeBottom,this.relativeLeft,this.relativeRight);


        event.target.append(this.draggedElement);
        event.target.classList.remove('hovered');
        this.allRelativeElements.forEach(item => {
            if (item !== null) {
                item.querySelector('.pietnastka-grid__number').classList.add('jsDraggable');
                item.querySelector('.pietnastka-grid__number').addEventListener('dragstart', this.boundDragStart);
                item.querySelector('.pietnastka-grid__number').addEventListener('dragend', this.boundDragEnd);
                item.querySelector('.pietnastka-grid__number').setAttribute('draggable', true);
            }
        });
        this.addListenersToEmpty();

    }
    boundDropHandler = this.dropHandler.bind(this);
}


let startGame = new FifteenTheGame();