(() => {
    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messageA_opacity_in: [0,1, {start: 0.1, end: 0.2}],
                messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
                messageB_opacity_in: [0,1, {start: 0.3, end: 0.4}],
                messageB_translateY_in: [20,0, {start: 0.3, end: 0.4}],
                messageC_opacity_in: [0,1, {start: 0.5, end: 0.6}],
                messageC_translateY_in: [20,0, {start: 0.5, end: 0.6}],
                messageD_opacity_in: [0,1, {start: 0.7, end: 0.8}],
                messageD_translateY_in: [20,0, {start: 0.7, end: 0.8}],
                
                messageA_opacity_out: [1,0, {start: 0.25, end: 0.3}],
                messageA_translateY_out: [0, -20, {start: 0.25, end: 0.3}],
                messageB_opacity_out: [1,0, {start: 0.45, end: 0.5}],
                messageB_translateY_out: [0, -20, {start: 0.45, end: 0.5}],
                messageC_opacity_out: [1,0, {start: 0.65, end: 0.7}],
                messageC_translateY_out: [0, -20, {start: 0.65, end: 0.7}],
                messageD_opacity_out: [1,0, {start: 0.85, end: 0.9}],
                messageD_translateY_out: [0, -20, {start: 0.85, end: 0.9}],
            }
        },
        {
            // 1
            type: 'normal',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];
    
    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위차한 스크롤 섹션들의 스크롤 높이의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true;

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i=0; i <sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        let totalScrollHeight = 0;
        let yOffset = window.pageYOffset;

        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 씬(스크롤 섹션)에서 스크롤 된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            
            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
            rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if(currentYOffset < partScrollStart) {
                rv = values[0];
            } else if(currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log("0 play");
                if (scrollRatio <= 0.22) {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
                }
                if (scrollRatio <= 0.42) {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translateY(${calcValues(values.messageB_translateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translateY(${calcValues(values.messageB_translateY_out, currentYOffset)}%)`;
                }
                if (scrollRatio <= 0.62) {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translateY(${calcValues(values.messageC_translateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translateY(${calcValues(values.messageC_translateY_out, currentYOffset)}%)`;
                }
                if (scrollRatio <= 0.82) {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translateY(${calcValues(values.messageD_translateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translateY(${calcValues(values.messageD_translateY_out, currentYOffset)}%)`;
                }
                break;
            case 1:
                // console.log("1 play");

                break;
            case 2:
                // console.log("2 play");
                break;
            case 3:
                // console.log("3 play");
                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // 브라우저 바운스 효과로 currentScene이 음수가 되는 것을 방지.
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return;

        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    window.addEventListener('DOMContentLoaded',setLayout);
    // window.addEventListener('load',setLayout);
    window.addEventListener('resize',setLayout);

    setLayout();

})();