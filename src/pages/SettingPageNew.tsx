import { useEffect, useRef, useState } from "react";
import SubHeader from "../components/SubHeader";
import { UsersRound, ImageUp, Trash2, ImagePlus, Folder, Plus, Save, SquarePen, UserRoundPlus, SmilePlus, HouseHeart } from 'lucide-react';
import { KidRepository } from "../repositories/kidRepository";
import KidCard from "../components/KidCard";
import toast from "react-hot-toast";
import ChunkyButton from "../components/ChunkyButton";

interface UploadedFile {
    file: File;
    kidName: string;
}

const MAX_LENGTH = 15;

export default function SettingPageNew() {

    // 아직 안씀(햇살반)
    const [groupName, setGroupName] = useState('');
    // 업로드한 파일
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    // 업로드한 파일 db에 저장중
    const [isSaving, setIsSaving] = useState(false);
    // db에서 아이들 불러오기
    const [isLoading, setIsLoading] = useState(true);
    // 저장된 아이들 수정모드
    const [isEditMode, setIsEditMode] = useState(false);
    // 저장된 아이들
    const [kids, setKids] = useState<any[]>([]);

    useEffect(() => {
        loadKids();
    }, []);

    //db에서 저장된 아이들 불러오기
    const loadKids = async () => {
        setIsLoading(true);
        setIsEditMode(false);
        const data = await KidRepository.findAll();
        setKids(data || []);
        setIsLoading(false);
    };

    // 3. 이름 변경 (리액트 상태만 업데이트)
    const handleNameChange = (id: number, newName: string) => {
        setKids(prev => prev.map(k => k.id === id ? { ...k, kidName: newName } : k));
    };

    // 4. 일괄 저장 (이때만 DB에 반영)
    const handleSaveAll = async () => {
        const hasEmptyName = kids.some(kid => kid.kidName.trim() === "");

        if (hasEmptyName) {
            toast.error("모든 아이들의 이름을 입력해주세요!");
            return;
        }

        try {
            await Promise.all(kids.map(k => KidRepository.updateKidName(k.id, k.kidName.trim())));
            toast.success("모든 변경사항이 저장되었습니다!");
            setIsEditMode(false);
        } catch (error) {
            toast.error("저장 중 오류가 발생했습니다.");
        }
    };

    // 5. 삭제 (즉시 DB 반영 + 상태 반영)
    const removeKidById = async (id: number, name: string) => {
        if (window.confirm(`${name} 친구를 삭제할까요?`)) {
            try {
                await KidRepository.delete(id);
                setKids(prev => prev.filter(k => k.id !== id)); // 화면에서도 즉시 제거
                toast.success(`${name}(이)가 성공적으로 삭제되었습니다.`);
            } catch (error) {
                console.error("삭제 실패:", error);
                toast.error("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    const removeAllKids = async () => {
        // 1. 실수로 누르는 것을 방지하기 위한 안전장치
        if (window.confirm("저장된 모든 친구들의 정보를 정말 삭제하시겠어요?\n이 작업은 되돌릴 수 없습니다.")) {
            try {
                // 2. Repository의 deleteAll 호출
                await KidRepository.deleteAll();
                loadKids();
                // 3. 성공 알림
                toast.success("모든 데이터가 성공적으로 삭제되었습니다.");
            } catch (error) {
                console.error("전체 삭제 실패:", error);
                toast.error("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 1. 파일 선택 시 실행
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
                .filter(file => file.type.startsWith('image/'))
                .map(file => {
                    const normalizedFileName = file.name.normalize('NFC'); //한글 깨짐 방지
                    const defaultName = normalizedFileName.split('.').slice(0, -1).join('.') || file.name;
                    return {
                        file,
                        kidName: defaultName.slice(0, MAX_LENGTH) //15자 제한
                    };
                });

            // 기존 파일 목록에 새로 선택한 파일들을 추가 (누적 방식)
            setUploadedFiles((prev) => [...prev, ...newFiles]);
        }

        if (e.target.value) e.target.value = ''; // 같은 파일 재선택 가능하게 리셋
    };

    // 2. 저장 버튼 클릭 시 실행
    const handleFileSave = async () => {
        if (uploadedFiles.length === 0) {
            toast.error("사진을 업로드해주세요.");
            return;
        }

        const hasEmptyName = uploadedFiles.some(file => file.kidName.trim() === "");
        if (hasEmptyName) {
            toast.error("모든 아이들의 이름을 입력해주세요!");
            return;
        }

        setIsSaving(true);
        setIsLoading(true);

        try {
            // Promise.all을 사용하여 모든 파일을 병렬로 저장
            await Promise.all(
                uploadedFiles.map((uploadedFile) =>
                    // 이름 인자를 빈 문자열("")로 보내면 Repository 로직에 의해 파일명으로 자동 저장됨
                    KidRepository.add(uploadedFile.kidName, uploadedFile.file)
                )
            );

            await loadKids();
            toast.success(`${uploadedFiles.length}명의 아이가 성공적으로 등록되었습니다!`);
            setUploadedFiles([]); // 선택 목록 초기화
        } catch (error) {
            console.error(error);
            toast.error("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
            setIsLoading(false);
        }
    };

    const updateFileNameByIndex = (indexToUpdate: number, newName: string) => {
        setUploadedFiles(prev =>
            prev.map((file, index) =>
                index === indexToUpdate
                    ? { ...file, kidName: newName } // 해당 인덱스면 이름을 교체한 새 객체 반환
                    : file // 아니면 기존 객체 유지
            )
        );
    };

    const removeFileByIndex = (indexToRemove: number) => {
        setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const removeAllFiles = () => {
        if (isSaving) return;

        setUploadedFiles([]);
        setIsSaving(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const fileInputRef = useRef<HTMLInputElement>(null);


    return (
        <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">

            {/* 서브 헤더 */}
            <SubHeader title="우리 반 설정" />

            {/* 메인 콘텐츠 */}
            <main className="w-full max-w-4xl p-4">
                {/* 기본 설정 카드 */}
                <div className="bg-white rounded-3xl shadow-2xl p-5 mt-4 mb-6 w-full">
                    {/* 그룹명 입력 */}
                    <div className="flex items-center gap-3 text-lg mb-5">
                        <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
                            <HouseHeart className="w-6 h-6" />
                        </div>
                        <div className="text-purple-900 font-bold text-xl">
                            우리 반 이름
                        </div>
                    </div>

                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        //className="w-full px-6 py-4 bg-purple-50 border-2 border-purple-100 rounded-2xl text-purple-700 placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all font-jua text-xl shadow-inner"
                        className="w-full px-6 py-4 bg-purple-50/50 border-2 border-purple-100 rounded-3xl text-purple-700 placeholder-purple-200 focus:outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100/50 transition-all shadow-inner"
                        placeholder="예: 햇살반"
                        maxLength={15}
                    />
                </div>

                {/* 사진 업로드 카드 */}
                <div className="bg-white rounded-3xl shadow-2xl p-5 mb-6 w-full">
                    {/* 타이틀 영역 & 전체삭제 */}
                    <div className="flex items-center justify-between mb-5">

                        <div className="flex items-center gap-3 text-lg">
                            <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
                                <SmilePlus className="w-6 h-6" />
                            </div>
                            <div className="text-purple-900 font-bold text-xl">
                                새 친구 저장하기
                            </div>
                        </div>

                        {/* 사진이 있을 때만 삭제 버튼 표시 */}
                        {uploadedFiles.length > 0 && !isSaving && (
                            <ChunkyButton onClick={removeAllFiles} size="xs" variant="error" icon={Trash2}>
                                전체삭제
                            </ChunkyButton>
                        )}
                    </div>

                    {/* 실제 인풋 (숨김) */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                    />

                    {/* 업로드 된 사진이 있을때 / 없을때 */}
                    {uploadedFiles.length > 0 ?
                        (
                            <div
                                className="rounded-3xl p-3 transition-all border-2 border-purple-100 bg-white shadow-inner max-h-[60vh] overflow-y-auto block scrollbar-hide"
                            >
                                <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {uploadedFiles.map((uploadedFile, index) => (
                                        <KidCard
                                            key={`file-${index}`}
                                            kidName={uploadedFile.kidName}
                                            image={uploadedFile.file}
                                            onRemove={() => removeFileByIndex(index)}
                                            onNameChange={(newName) => updateFileNameByIndex(index, newName)}
                                            isEditMode={!isSaving}
                                            maxLength={MAX_LENGTH}
                                        />
                                    ))}

                                    {/* 사진 추가 버튼 카드 */}
                                    {!isSaving &&
                                        <>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="min-h-50 bg-purple-50/50 rounded-2xl border-2 border-dashed border-purple-200/60 hover:border-purple-400 hover:bg-purple-100/80 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 pt-[22px] pb-[22px]"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white/40 border border-white/20 flex items-center justify-center shadow-sm backdrop-blur-[2px] group-hover:scale-110 group-hover:bg-white/60 transition-all duration-300">
                                                    <Plus className="w-7 h-7 text-purple-500/80 group-hover:text-purple-600" />
                                                </div>
                                                <span className="mt-6 text-[11px] font-bold text-purple-400 group-hover:text-purple-600 transition-colors">사진 추가</span>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        )
                        :
                        (
                            <div
                                className="relative rounded-3xl p-3 transition-all duration-500 border-4 border-dashed border-slate-200 bg-slate-50/30 h-[320px] flex flex-col items-center justify-center hover:bg-white hover:border-purple-300 group overflow-hidden"
                            >
                                {/* 호버 시 배경에 살짝 퍼지는 보라색 광채 효과 */}
                                <div className="absolute inset-0 bg-gradient-to-b from-purple-100/0 to-purple-100/0 group-hover:from-purple-50 group-hover:to-white transition-all duration-500" />

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative z-10 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                >
                                    {/* 아이콘 박스: 평소엔 차분, 호버 시 공중에 뜨는 느낌 */}
                                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-purple-200 group-hover:rotate-3 transition-all duration-500 ease-out">
                                        <ImageUp className="w-12 h-12 text-slate-400 group-hover:text-purple-500 transition-colors duration-500" />
                                    </div>

                                    {/* 텍스트 영역 */}
                                    <div className="text-center space-y-2">
                                        <p className="text-2xl font-black text-slate-400 group-hover:text-purple-600 transition-colors duration-500 tracking-tight">
                                            친구 사진을 추가해 주세요
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-slate-300 group-hover:text-purple-300 transition-colors duration-500">
                                            <span className="h-px w-8 bg-current opacity-30"></span>
                                            <p className="text-sm font-bold italic px-2">
                                                여기에 클릭 또는 드래그
                                            </p>
                                            <span className="h-px w-8 bg-current opacity-30"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* 저장 버튼 */}
                    {uploadedFiles.length > 0 &&
                        <ChunkyButton onClick={handleFileSave} icon={Save} size="lg" className="w-full mt-4" variant="secondary" disabled={isSaving}>

                            {isSaving ? "저장중..." : `${uploadedFiles.length}명 저장하기`}
                        </ChunkyButton>
                    }
                </div>


                {/* 저장된 친구들 목록 카드 */}
                <div className="bg-white rounded-3xl shadow-2xl p-5 mb-6 w-full">
                    <div className="flex items-center justify-between mb-5">

                        <div className="flex items-center gap-3 text-lg">
                            <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
                                <Folder className="w-6 h-6" />
                            </div>
                            <div className="text-purple-900 font-bold text-xl">
                                저장된 친구들
                            </div>
                            <div className="px-3 py-1 bg-purple-50 text-purple-500 text-xs font-black rounded-full border border-purple-100 flex items-center gap-1">
                                <span className="text-purple-700 text-sm">{kids.length}</span>
                                <span className="opacity-60">명</span>
                            </div>
                        </div>

                        {kids.length > 0 && (
                            isEditMode ? (
                                <div className="flex gap-2">
                                    <ChunkyButton onClick={removeAllKids} size="xs" variant="error" icon={Trash2}>
                                        전체삭제
                                    </ChunkyButton>
                                    <ChunkyButton onClick={handleSaveAll} size="xs" variant="success" icon={Save}>
                                        저장하기
                                    </ChunkyButton>
                                </div>
                            ) : (
                                <ChunkyButton onClick={() => setIsEditMode(true)} size="xs" variant="primary" icon={SquarePen}>
                                    수정하기
                                </ChunkyButton>
                            )
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4" />
                            <p className="text-purple-400 font-bold">친구들 목록을 불러오고 있어요...</p>
                        </div>
                    ) :
                        kids.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {kids.map(kid =>
                                    <KidCard
                                        key={kid.id}
                                        kidName={kid.kidName}
                                        image={kid.image}
                                        onRemove={() => removeKidById(kid.id!, kid.kidName)}
                                        onNameChange={(newName) => handleNameChange(kid.id, newName)}
                                        isEditMode={isEditMode}
                                        maxLength={MAX_LENGTH}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-3xl border-2 border-gray-200">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <UsersRound className="w-10 h-10 text-gray-300" />
                                </div>
                                <p className="text-xl font-bold text-gray-400">아직 저장된 친구가 없어요</p>
                            </div>
                        )}
                </div>
            </main>

        </div>
    );
}