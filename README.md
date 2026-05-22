# bit.fall

Julius Popp의 설치 미술 [bit.fall](https://www.julius-popp.com/bit-fall)을 리버스 엔지니어링한 웹 실험.

텍스트가 물방울로 쪼개져 중력에 따라 떨어집니다.

![preview](https://user-images.githubusercontent.com/8598722/90392427-cec09f80-e0c9-11ea-8571-a8054bcddbf7.png)

## 동작 방식

1. 입력한 텍스트를 오프스크린 캔버스에 렌더링
2. 픽셀을 격자 샘플링 → 이진 행렬 (노즐 × 행)
3. 각 행마다 활성 노즐에서 파티클 방출
4. 프레임마다 중력 적용 → 파티클이 아래로 가속하며 떨어짐
5. 가산 블렌딩(`lighter`)으로 겹치는 물방울이 밝게 빛남

## 스택

- **Next.js 15** — Vercel 배포 최적화
- **Canvas 2D API** — p5.js 없이 직접 구현
- **TypeScript** — 타입 안전한 파티클 엔진

## 로컬 실행

```sh
npm install
npm run dev
```

`+` 버튼을 누르고 텍스트를 입력하면 다음 사이클에 표시됩니다.

## 배포

Vercel에 레포지토리를 연결하면 자동 배포됩니다. 별도 설정 불필요.
