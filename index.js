class AdvancedCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = {};

        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        this.weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        this.calendarContainer = document.querySelector('.calendar-container');
        this.currentDateElement = document.getElementById('currentDate');
        this.daysContainer = document.getElementById('days');
        this.weekdaysContainer = document.getElementById('weekdays');

        this.prevYearBtn = document.getElementById('prevYear');
        this.nextYearBtn = document.getElementById('nextYear');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.todayBtn = document.getElementById('todayBtn');

        this.eventModal = document.getElementById('eventModal');
        this.closeModalBtn = document.querySelector('.close');
        this.saveEventBtn = document.getElementById('saveEvent');

        this.initCalendar();
        this.addEventListeners();
    }

    initCalendar() {
        this.renderWeekdays();
        this.renderCalendar();
    }

    renderWeekdays() {
        this.weekdaysContainer.innerHTML = this.weekdays
            .map(day => `<div>${day}</div>`)
            .join('');
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        this.currentDateElement.textContent = `${this.monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        this.daysContainer.innerHTML = '';

        for (let i = 0; i < firstDayOfMonth; i++) {
            this.daysContainer.innerHTML += '<div class="empty"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${month + 1}-${day}`;
            const isToday = this.isToday(year, month, day);
            const isSelected = this.isSelected(year, month, day);
            const hasEvent = this.events[dateString];

            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.classList.add('calendar-day');
            if (isToday) dayElement.classList.add('today');
            if (isSelected) dayElement.classList.add('selected');
            if (hasEvent) dayElement.classList.add('has-event');

            dayElement.addEventListener('click', () => this.selectDate(year, month, day));

            this.daysContainer.appendChild(dayElement);
        }
    }

    isToday(year, month, day) {
        const today = new Date();
        return year === today.getFullYear() &&
               month === today.getMonth() &&
               day === today.getDate();
    }

    isSelected(year, month, day) {
        return this.selectedDate &&
               year === this.selectedDate.getFullYear() &&
               month === this.selectedDate.getMonth() &&
               day === this.selectedDate.getDate();
    }

    selectDate(year, month, day) {
        this.selectedDate = new Date(year, month, day);
        this.renderCalendar();
        this.showEventModal();
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }

    changeYear(delta) {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + delta);
        this.renderCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    showEventModal() {
        this.eventModal.style.display = 'block';
    }

    closeEventModal() {
        this.eventModal.style.display = 'none';
    }

    saveEvent() {
        const dateString = this.selectedDate.toISOString().split('T')[0];
        const title = document.getElementById('eventTitle').value;
        const description = document.getElementById('eventDescription').value;

        if (title) {
            this.events[dateString] = { title, description };
            this.renderCalendar();
            this.closeEventModal();
        }
    }

    addEventListeners() {
        this.prevYearBtn.addEventListener('click', () => this.changeYear(-1));
        this.nextYearBtn.addEventListener('click', () => this.changeYear(1));
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        this.todayBtn.addEventListener('click', () => this.goToToday());
        this.closeModalBtn.addEventListener('click', () => this.closeEventModal());
        this.saveEventBtn.addEventListener('click', () => this.saveEvent());

        window.addEventListener('click', (event) => {
            if (event.target === this.eventModal) {
                this.closeEventModal();
            }
        });
    }
}

// Initialize the calendar
const calendar = new AdvancedCalendar();