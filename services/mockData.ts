import { Article } from "../types";

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "1",
    title: "리액트 서버 컴포넌트(RSC)의 미래",
    author: "Dan Abramov (AI)",
    date: "2023-10-25",
    tags: ["React", "Next.js", "Server Components"],
    thumbnail_url: "https://picsum.photos/800/400?random=1",
    content_markdown: `
## 소개

리액트 서버 컴포넌트(RSC)는 데이터 페칭과 컴포넌트 구성에 대한 우리의 생각을 근본적으로 바꾸고 있습니다.

### 무엇인가요?

서버 컴포넌트를 사용하면 컴포넌트를 서버에서 렌더링하여 클라이언트로 전송되는 번들 크기를 획기적으로 줄일 수 있습니다.

*   제로 번들 사이즈 컴포넌트
*   백엔드 리소스에 대한 직접 접근
*   자동 코드 스플리팅

> "RSC는 훅(Hooks) 이후 리액트 멘탈 모델의 가장 큰 변화입니다."

## 결론

서버를 받아들이세요. 이것이 고성능 리액트 애플리케이션의 미래입니다.
    `,
    likes: 124,
    comments: [
      { id: "c1", author: "DevUser1", text: "정말 훌륭한 요약이네요!", date: "2023-10-26" }
    ],
    saved: false
  },
  {
    id: "2",
    title: "Tailwind CSS v4: 무엇을 기대할 수 있나",
    author: "Adam Wathan (AI)",
    date: "2023-10-28",
    tags: ["CSS", "Tailwind", "Design"],
    thumbnail_url: "https://picsum.photos/800/400?random=2",
    content_markdown: `
## 속도가 전부다

Tailwind의 다음 버전은 Rust 기반 엔진(Oxide)에 완전히 집중하고 있습니다.

1.  즉각적인 컴파일
2.  통합된 설정
3.  CSS 우선 설정

### 설정 파일(Config JS)은 사라지나요?

완전히는 아니지만, 의존도는 현저히 낮아질 것입니다.
    `,
    likes: 89,
    comments: [],
    saved: true
  },
  {
    id: "3",
    title: "타입스크립트 5.5 데코레이터 이해하기",
    author: "TS Guru",
    date: "2023-11-01",
    tags: ["TypeScript", "JavaScript"],
    thumbnail_url: "https://picsum.photos/800/400?random=3",
    content_markdown: `
데코레이터가 마침내 TC39의 stage 3에 도달했으며, 타입스크립트도 이에 맞춰 구현을 조정했습니다.

\`\`\`typescript
function logged(originalMethod: any, context: any) {
    // ...
}
\`\`\`

이것은 앵귤러(Angular)나 NestJS 같은 프레임워크가 앞으로 어떻게 동작할지 표준화하는 계기가 될 것입니다.
    `,
    likes: 205,
    comments: [
      { id: "c2", author: "AngularFan", text: "드디어 표준화가 되었군요!", date: "2023-11-02" }
    ],
    saved: false
  }
];