import { createStore } from "redux";

// DOM 선언
const divToggle = document.querySelector('.toggle');
const counter = document.querySelector('h1');
const btnIncrease = document.querySelector('#increase');
const btnDecrease = document.querySelector('#decrease');

// Action 이름 정의 : 액선 이름은 주로 대문자로 작성하며 액션 이름은 고유해야 함
const TOGGLE_SWITCH = 'TOGGLE_SWITCH';
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

// Action 생성 함수 작성 : 액션 객체는 type 값을 반드시 가지고 있어야 함
const toggleSwitch = () => ({type: TOGGLE_SWITCH});
const increase = difference => ({type: INCREASE, difference});
const decrease = () => ({type: DECREASE});

// 프로젝트에서 사용할 초기값 정의
const initialState = {
    toggle: false,
    counter: 0
};

// 리듀서(변화를 일으키는 함수) 함수 정의 : 함수의 파라미터로는 state와 action 값을 받아옴
function reducer(state = initialState, action) {
    // state가 undefined일 시 initialState를 기본 사용
    switch (action.type) {
        case TOGGLE_SWITCH:
            return {
                ...state,
                // 리듀셔에서는 상태의 불변성을 유지하면서 데이터에 변화를 줘야 함.
                // spread 연산자 사용하면 편하지만 객체의 구조가 복잡해지만 굉장히 번거로워지기 때문에 리덕스의 상태는 깊지 않은 구조로 진행하는 것이 좋음
                // 객체구조가 복잡해지거나 배열도 함께 다루는 경우에 immer 라이브러리 사용시 편함
                toggle: !state.toggle,
            };
        case INCREASE:
            return {
                ...state,
                counter: state.counter + action.difference
            };
        case DECREASE:
            return {
                ...state,
                counter: state.counter - 1
            };
        default:
            return state;
    }
}


// 스토어 만들기 : 파라미터에는 리듀서 함수를 넣어야 함
const store = createStore(reducer);

// render 함수 만들기
const render = () => {
    const state = store.getState(); // 현재 상태를 불러옴
    // toggle 처리
    if (state.toggle) {
        divToggle.classList.add('active');
    } else {
        divToggle.classList.remove('active');
    }
    // counter 처리
    counter.innerText = state.counter;
};
render();

// 구독하기
const listener = () => {
    console.log('상태 업데이트');
}
const unsubscribe = store.subscribe(listener);
unsubscribe();
