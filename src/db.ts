import Dexie, { type Table } from 'dexie';

export interface Kid {
    id?: number;
    kidName: string;   // 아이 이름
    fileName: string;  // 파일명
    image: Blob;       // 사진 데이터
    createdAt: number;
}

export class EduPlayDB extends Dexie {

    kids!: Table<Kid>;

    constructor() {
        super('EduPlayDB');
        this.version(1).stores({
            kids: '++id, kidName, createdAt' // id는 자동증가, 검색용 인덱스 설정
        });
    }
}

export const db = new EduPlayDB();