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

// Action 생성 함수 : 액션 객체는 type 값을 반드시 가지고 있어야 함
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

// 구독하기 : 스토어 상태가 바뀔때마다 render 함수가 호출되도록
// const listener = () => {
//     console.log('상태 업데이트');
// }
// const unsubscribe = store.subscribe(listener); //파라미터로 함수 형태의 값 전달
// unsubscribe(); //추후 구독 비활성화 시 함수 호출
store.subscribe(render); //액션 발생해서 상태 업데이트 될 때마다 호출
// react 프로젝트에서는 react-redux 라이브러리가 작업을 대신하기 때문에 subscribe 함수 직접 호출하지 않음


// 액션 발생시키기 (dispatch)
divToggle.onclick = () => {
    store.dispatch(toggleSwitch());
};
btnIncrease.onclick = () => {
    store.dispatch(increase(1));
};
btnDecrease.onclick = () => {
    store.dispatch(decrease());
};


/*
* 리덕스의 세 가지 규칙
*
* 1. 단일 스토어
* 하나의 애플리케이션 안에는 하나의 스토어.
* 여러개일 시 특정 업데이트가 너무 빈번하게 일어나거나 상태관리가 복잡해 질 수 있음
*
* 2. 읽기 전용 상태
* 리덕스 상태는 읽기 전용.
* 상태를 업데이트할 때 기존의 객체는 건드리지 않고 새로운 객체를 생성해야 함.
* 리덕스에서 불변성을 유지해야하는 이유는 내부적으로 데이터가 변경되는 것을 감지하기 위해
* 얕은 비교 검사를 하기 떄문. 객체 변화 감지 시 객체의 깊은 안까지 비교하는게 아니라 겉핥기 식으로 비교해 좋은 성능을 유지하기 때문
*
* 3. 리듀서는 순수한 함수
* 변화를 일으키는 리듀서 함수는 순수한 함수여야 함
* <순수한 함수의 조건>
* - 리듀서 함수는 이전상태와 액션 객체를 파라미터로 받음
* - 파라미터 외의 값에는 의존하면 안됨
* - 이전 상태는 절대로 건드리지 않고 변화 준 새로운 상태 객체를 만들어 반환해야 함
* - 똑같은 파라미터로 호출된 리듀서 함수는 언제나 같은 결과 값을 반환해야 함
*
* 예를 들면 리듀서 함수 내부에서 랜덤 값을 만들거나 Date 함수를 사용해 현재 시간을 가져오거나
* 네트워크 요청을 한다면 파라미터가 같아도 다른 결과값을 만들어낼 수 있기 떄문에 사용하면 안됨
* 이러한 작업은 리듀서 함수 바깥에서 처리해야 함. (액션 생성 과정이나 리덕스 미들웨어에서 처리)
*
*
* 액션 타입 -> 액션 생성 함수 작성 -> 초기값 설정 -> 리듀서 작성 -> 스토어 생성 -> render함수 -> 스토어 구독 subscribe -> 액션 발생 dispatch
* */
