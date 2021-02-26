(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위차한 스크롤 섹션들의 스크롤 높이의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true;
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

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
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages:[]
            },
            values: {
                videoImageCount: 209,
                imageSequence: [0,208],
                canvas_opacity: [1,0, {start: 0.93, end: 0.98}],

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
            // heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
            }

        },
        {
            // 2
            type: 'sticky',
            heightNum: 6, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages:[]
            },
            values: {
                videoImageCount: 368,
                imageSequence: [0,367],
                canvas_opacity_in: [0,1, {start: 0.08, end: 0.13}],
                canvas_opacity_out: [1,0, {start: 0.93, end: 0.98}],
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.55, end: 0.65 }],
				messageC_translateY_in: [30, 0, { start: 0.80, end: 0.87 }],
				messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
				messageB_opacity_in: [0, 1, { start: 0.55, end: 0.65 }],
				messageC_opacity_in: [0, 1, { start: 0.80, end: 0.87 }],
				messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
				messageB_translateY_out: [0, -20, { start: 0.72, end: 0.77 }],
				messageC_translateY_out: [0, -20, { start: 0.90, end: 0.95 }],
				messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				messageB_opacity_out: [1, 0, { start: 0.72, end: 0.77 }],
				messageC_opacity_out: [1, 0, { start: 0.90, end: 0.95 }],
				pinB_scaleY: [0.5, 1, { start: 0.55, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.82, end: 0.87 }]
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 7, // 브라우저 높이의 6배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas: document.querySelector('.image-blend-canvas'),
                context: document.querySelector('.image-blend-canvas').getContext('2d'),
                imagesPath: [
                    './images/blend-image-1.jpeg',
                    './images/blend-image-2.jpeg'
                ],
                images: []
            },
            values: {
                rect1X: [ 0, 0, { start: 0, end: 0 }],
                rect2X: [ 0, 0, { start: 0, end: 0 }],
                blendHeight : [ 0, 0, { start: 0, end: 0 }],
                canvas_scale : [ 0, 0, {start: 0, end:0 }],
                canvasCaption_opacity: [0, 1, { start: 0, end: 0}],
                canvasCaption_translateY: [0, 1, { start: 0, end: 0}],
                rectStartY: 0
            }
        }
    ];

    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            let src;
            if (i<9) src = `./videotest/yangpyeongkong/000${i+1}.jpg`;
            else if (i<99) src = `./videotest/yangpyeongkong/00${i+1}.jpg`;
            else src = `./videotest/yangpyeongkong/0${i+1}.jpg`;
            imgElem.src = src;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }
        let imgElem2;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            let src2;
            if (i<9) src2 = `./videotest/chocokong01/000${i+1}.jpg`;
            else if (i<99) src2 = `./videotest/chocokong01/00${i+1}.jpg`;
            else src2 = `./videotest/chocokong01/0${i+1}.jpg`;
            imgElem2.src = src2;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }

        let imgElem3;
        for (let i=0; i<sceneInfo[3].objs.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagesPath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
    }

    function checkMenu() {
        if (yOffset > 44) {
            document.body.classList.add('local-nav-sticky');
        } else {
            document.body.classList.remove('local-nav-sticky');
        }
    }

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

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;
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
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence],0,0, sceneInfo[0].objs.canvas.width, sceneInfo[0].objs.canvas.height);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
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
                if (scrollRatio <= 0.59) {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translateY(${calcValues(values.messageC_translateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translateY(${calcValues(values.messageC_translateY_out, currentYOffset)}%)`;
                }
                if (scrollRatio <= 0.88) {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translateY(${calcValues(values.messageD_translateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translateY(${calcValues(values.messageD_translateY_out, currentYOffset)}%)`;
                }
                break;
            case 2:
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence2],0,0, sceneInfo[2].objs.canvas.width, sceneInfo[2].objs.canvas.height);

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in,currentYOffset);

                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out,currentYOffset);
                }
				if (scrollRatio <= 0.32) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.67) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}

				if (scrollRatio <= 0.89) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
                
                // currentScene === 3 인 경우 사용되는 캔버스를 미리 그려주기 시작.
                if (scrollRatio > 0.9) {
                    const objs = sceneInfo[3].objs;
                    const values = sceneInfo[3].values;
                    // 가로 세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;
                    let canvasScaleRatio;
                    // let canvasScaleRatio = window.innerHeight / objs.canvas.height;

                    if (widthRatio <= heightRatio) {
                        // 캔버스보다 브라우저 창이 홀쭉한 경우
                        canvasScaleRatio = heightRatio;
                    } else {
                        // 캔버스보다 브라우저 창이 납작한 경우
                        canvasScaleRatio = widthRatio;
                    }
                    let imgHeight = objs.canvas.width*(objs.images[0].height/objs.images[0].width);
                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    objs.context.drawImage(objs.images[0],0,0,objs.canvas.width,imgHeight);

                    // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    // const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                    
                    const whiteRectWidth = recalculatedInnerWidth*0.25;
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
    
                    // 좌우 흰색 박스 그리기
                    objs.context.fillStyle = 'white';
                    objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth),objs.canvas.height);
                    objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth),objs.canvas.height);
                }

                break;
            case 3:
                // 가로 세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
				const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;
				// let canvasScaleRatio = window.innerHeight / objs.canvas.height;

				if (widthRatio <= heightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }
                let imgHeight = objs.canvas.width*(objs.images[0].height/objs.images[0].width);
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.drawImage(objs.images[0],0,0,objs.canvas.width,imgHeight);

                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                // const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                if (!values.rectStartY) {
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio)/2;
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }
                
                const whiteRectWidth = recalculatedInnerWidth*0.25;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 좌우 흰색 박스 그리기
                objs.context.fillStyle = 'white';
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth),objs.canvas.height);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth),objs.canvas.height);
                objs.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                );
                objs.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                );

                if (scrollRatio < values.rect1X[2].end) {
                    step = 1;
                    objs.canvas.classList.remove("sticky");
                } else {
                    step = 2;
                    // 이미지 블렌드
                    // blendHeight: [ 0, 0, { start: 0, end: 0 }]
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.15;
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);

                    objs.context.drawImage(objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                    );
                    objs.canvas.classList.add("sticky");
                    objs.canvas.style.top = `${0-(objs.canvas.height - objs.canvas.height * canvasScaleRatio)/2}px`;

                    if (scrollRatio > values.blendHeight[2].end) {
                        values.canvas_scale[0] = canvasScaleRatio;
                        values.canvas_scale[1] = document.body.offsetWidth / (objs.canvas.width*1.5);
                        values.canvas_scale[2].start = values.blendHeight[2].end;
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.15;

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)}`;
                        objs.canvas.style.marginTop = 0;
                    }

                    if (scrollRatio > values.canvas_scale[2].end
                        && values.canvas_scale[2].end > 0) {
                            objs.canvas.classList.remove("sticky");
                            objs.canvas.style.marginTop = `${scrollHeight*0.3}px`;

                            values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                            values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
                            objs.canvasCaption.style.opacity = calcValues(values.
                                canvasCaption_opacity, currentYOffset);

                            values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
                            values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;
                            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY,currentYOffset)}%)`;
                    }
                }

                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (delayedYOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // 브라우저 바운스 효과로 currentScene이 음수가 되는 것을 방지.
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return;

        playAnimation();
    }

    function loop() {
        delayedYOffset = delayedYOffset + (pageYOffset - delayedYOffset) * acc;

        if (!enterNewScene) {
            if (currentScene === 0 || currentScene === 2) {
            const currentYOffset = delayedYOffset - prevScrollHeight;
            const objs = sceneInfo[currentScene].objs;
            const values = sceneInfo[currentScene].values;
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if (objs.videoImages[sequence]) {
                    objs.context.drawImage(objs.videoImages[sequence],0,0, sceneInfo[0].objs.canvas.width, sceneInfo[0].objs.canvas.height);
                }
            }
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(pageYOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }

    window.addEventListener('load',() => {
        setLayout();
        document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0, sceneInfo[0].objs.canvas.width, sceneInfo[0].objs.canvas.height);

        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }

                tempScrollCount++;
            }, 20);
        }

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
            checkMenu();
    
            if(!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });
    });
    // window.addEventListener('load',setLayout);
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            window.location.reload();
        }
    });

    window.addEventListener('orientationchange', () => {
        scrollTo(0,0);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    });

    // document.querySelector('.loading').addEventListener('transitionend', (e) => {
    //     document.body.removeChild(e.currentTarget);
    // });

    setCanvasImages();
    setLayout();
})();