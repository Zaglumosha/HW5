type TQuiz = {
    title: string;
    options: string[];
    answer: number;
};

class Quiz{
    private node: HTMLElement | null = null;
    questions: TQuiz[] = [
        {
            title: 'На какой фильм Белла ходила в кинотеатр с Джейкобом и Майком?',
            options: ["Кулаком в морду", "Любовь всегда любовь","Техасская резня бензопилой","Нарвись на кулак"],
            answer: 0,
        },
        {
            title: 'Джасспер и Розали единственные в клане Калленов, чья фамилия Хейл.Почему?',
            options: ['Просто однофамильцы','Они притворяются двойняшками','Они же все Каллены.Какие Хейлы?','Они действительно брат и сестра в отличие от других Калленов'],
            answer: 1,
        },
        {
            title: 'Назовите марку машины на которой ездил Эдвард',
            options: ['Mercedes','Bmw','Volvo','Jeep'],
            answer: 2,
        },
        {
            title: 'Сколько лет было Эдварду?',
            options: ['16','18','17','19'],
            answer: 2,
        },
        {
            title: 'Какая фамилия у Джейкоба?',
            options: ['Квилет','Вулф','Адли','Блэк'],
            answer: 3,
        },
        {
            title: 'Чем занимался отчим Бэллы?',
            options: ['Музыкой','Баскетболом','Бейсболом','Теннисом'],
            answer: 2,
        },
        {
            title: 'В каком штате жил отец Бэллы?',
            options: ['Аризона','Вашингтон','Калифорния','Чикаго'],
            answer: 1,
        },
        {
            title: 'Какой талант получил Карлайл Каллен после обращения в вампира?',
            options: ['Никакой','Вампиризм обострил его способность к состраданию','Феноменальный самоконтроль','Обращать людей в вампиров'],
            answer: 1,
        },
        {
            title: 'В каком европейском городе обитает клан Вольтури?',
            options: ['Рим','Вольтерра','Ватикан','Вольтри'],
            answer: 1,
        },
        {
            title: 'Продолжите фразу Это кожа-...',
            options: ["...вампира,Бэлла","...светится,Бэлла","...убийцы,Бэлла","...младенца,Бэлла"],
            answer: 2,

        }
    ];
    private currentQuestion = 0;
    counter = 0;

    constructor(node: HTMLElement | null) {
        this.node = node;
    }

    next() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion += 1;
            console.info('current question is', this.currentQuestion);
        } else {
            const scorePercentage = Math.round((this.counter / this.questions.length) * 100);
            if (this.node) {
                this.node.innerHTML = `<h2 style="color: #8FBC8F; margin-top: 50px; size:30px;">Quiz Completed!</h2>
                <p style="color: #8FBC8F;font-size: 25px;">Правильных ответов: ${this.counter} из ${this.questions.length}</p>
                <p style="color: #8FBC8F;font-size: 25px;"
                
                >Очки в процентах: ${scorePercentage}%</p>`;
            }
        }
    }

    getQuestion(): TQuiz {
        return this.questions[this.currentQuestion];
    }

    checkAnswer(index: number, answer: number): boolean {
        if (this.questions[index].answer === answer) {
            this.counter++;            
        }

        return this.questions[index].answer === answer;
    }

    renderQuestion() {
        if(this.node){
            this.node.innerHTML = '';
        };
        for(let j = 0; j < this.questions.length; j++) {
            const div = document.createElement("div");
            const question = this.questions[j];
            div.classList.add("question");
            div.setAttribute('data-index', j.toString());
            div.addEventListener("click", (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                if (target.classList.contains('answer')) {
                    const answerStrIndex = target.getAttribute('data-index');
                    const questionStrIndex = target.parentElement?.getAttribute('data-index');
                    if (answerStrIndex && questionStrIndex) {
                        const result = this.checkAnswer(+questionStrIndex, +answerStrIndex);
                        if (result) {
                            target.classList.add('good');
                        } else {
                            target.classList.add('bad');
                            target.parentElement
                            ?.querySelectorAll(`[data-index="${this.questions[+questionStrIndex].answer}"]`)[0]
                            .classList.add('good');                            
                        }
                        for (const el of (target.parentElement?.getElementsByClassName('answer')??[])) {
                            el.setAttribute('disabled', 'true');
                        }
                        document.getElementById('next')?.removeAttribute('disabled');
                    }
                }
            });
            if (j === this.currentQuestion) {
                div.classList.add('visible');
            }
            const title = document.createElement("h2");
            title.classList.add('title');
            title.textContent = question.title;
            div.appendChild(title);
            for (let i = 0; i < question.options.length; i++) {
                const button = document.createElement("button");
                button.setAttribute('data-index', i.toString());
                button.textContent = question.options[i];
                button.classList.add('answer');
                div.appendChild(button);
            }
            this.node?.appendChild(div);
        }
        const nextButton = document.createElement('button');
        nextButton.classList.add('btnNext')
        nextButton.id = 'next';
        nextButton.textContent = 'Следующий вопрос';
        nextButton.disabled = true;
        nextButton.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            this.next();
            const q = target.parentElement?.getElementsByClassName('visible')[0];
            q?.classList.remove('visible');
            q?.nextElementSibling?.classList.add('visible');
            target.setAttribute('disabled', 'true');
        });
        this.node?.appendChild(nextButton);       
    }

    renderStart() {
        const divS = document.createElement("div");
        divS.classList.add("start");

        const titleS = document.createElement("h2");
        titleS.classList.add('startTitle');
        titleS.id= 'startName';
        titleS.textContent = 'Quiz по Сумеркам';
        const startButton = document.createElement('button');
        startButton.id = 'start';
        startButton.classList.add('startButton');
        startButton.textContent = 'Начать тест';
        startButton.addEventListener('click', () =>{
            this.renderQuestion();
        });
        this.node?.appendChild(divS);
        this.node?.appendChild(titleS);
        this.node?.appendChild(startButton);
    }
};

function app(){
    document.addEventListener('DOMContentLoaded', () => {
        const app: HTMLElement | null = document.getElementById("app");
        const quiz = new Quiz(app);
        quiz.renderStart();
    });
}

app();