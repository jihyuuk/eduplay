import Dexie, { type Table } from 'dexie';

//카드 뒤집기
export interface Kid {
    id?: number;
    kidName: string;   // 아이 이름
    fileName: string;  // 파일명
    image: Blob;       // 사진 데이터
    createdAt: number;
}

export interface FacePartBox {
    x: number;
    y: number;
    w: number;
    h: number;
}

//얼굴 퀴즈
export interface FaceQuizItem {
    id?: number;
    kidName: string;   // 아이 이름
    fileName: string;  // 파일명
    image: Blob;       // 사진 데이터
    createdAt: number;

    // 얼굴 부위 좌표
    leftEye: FacePartBox;
    rightEye: FacePartBox;
    nose: FacePartBox;
    mouth: FacePartBox;

}

export class EduPlayDB extends Dexie {

    kids!: Table<Kid>;
    faceQuizItems!: Table<FaceQuizItem>;

    constructor() {
        super('EduPlayDB');
        this.version(2).stores({
            kids: '++id, kidName, createdAt', // id는 자동증가, 검색용 인덱스 설정
            faceQuizItems: '++id, kidName, createdAt' // id는 자동증가, 검색용 인덱스 설정
        });
    }
}

export const db = new EduPlayDB();