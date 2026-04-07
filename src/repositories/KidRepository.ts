import { db, type Kid } from '../db';

export const KidRepository = {

  // 아이 등록 (유효성 검사 포함)
  add: async (name: string, file: File) => {

    // 이름이 비어있다면 파일명을 기본값으로 사용
    const kidName = name.trim()
      ? name.trim()
      : file.name.split('.').slice(0, -1).join('.') || file.name;

    const newKid: Kid = {
      kidName: kidName,
      fileName: file.name,
      image: file,
      createdAt: Date.now(),
    };

    return await db.kids.add(newKid);
  },


  // 전체 아이 목록 가져오기 (최신순)
  findAll: async () => {
    return await db.kids
      .orderBy('createdAt')
      .reverse()
      .toArray();
  },


  // Id로 조히
  findById: async (id: number) => {
    return await db.kids.get(id);
  },


  // 이름 변경
  updateKidName: async (id: number, newName: string) => {
    if (!newName.trim()) throw new Error("이름을 입력해주세요");
    return await db.kids.update(id, { kidName: newName.trim() });
  },

  // 삭제
  delete: async (id: number) => {
    return await db.kids.delete(id);
  },

  // 전체 삭제
  deleteAll: async () => {
    return await db.kids.clear();
  },
};