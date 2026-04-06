import { useRef, useState, type ChangeEvent } from "react";
import SubHeader from "../components/SubHeader";
import { UsersRound, ImageUp, Trash2, ImagePlus, Folder, Plus, X, Save } from 'lucide-react';
import { useLiveQuery } from "dexie-react-hooks";
import { KidRepository } from "../repositories/kidRepository";
import KidCard from "../components/KidCard";
import toast from "react-hot-toast";
import ChunkyButton from "../components/ChunkyButton";

interface UploadedFile {
    file: File;
    kidName: string;
    image: string;
}


export default function SettingPage() {

    const [groupName, setGroupName] = useState('');

    //여긴 만든거
    const kids = useLiveQuery(() => KidRepository.findAll());

    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    // 1. 파일 선택 시 실행
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
                .filter(file => file.type.startsWith('image/'))
                .map(file => {
                    const defaultName = file.name.split('.').slice(0, -1).join('.') || file.name;
                    return {
                        file,
                        kidName: defaultName,
                        image: URL.createObjectURL(file),
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

        setIsUploading(true);

        try {
            // Promise.all을 사용하여 모든 파일을 병렬로 저장
            await Promise.all(
                uploadedFiles.map((uploadedFile) =>
                    // 이름 인자를 빈 문자열("")로 보내면 Repository 로직에 의해 파일명으로 자동 저장됨
                    KidRepository.add(uploadedFile.kidName, uploadedFile.file)
                )
            );

            toast.success(`${uploadedFiles.length}명의 아이가 성공적으로 등록되었습니다!`);
            setUploadedFiles([]); // 선택 목록 초기화
        } catch (error) {
            console.error(error);
            toast.error("저장 중 오류가 발생했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeFileByIndex = (indexToRemove: number) => {
        setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const removeAllFiles = () => {
        setUploadedFiles([]);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const fileInputRef = useRef<HTMLInputElement>(null);


    return (
        <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">

            {/* 서브 헤더 */}
            <SubHeader title="설정" />

            {/* 메인 콘텐츠 */}
            <main className="w-full max-w-3xl p-4">
                {/* 기본 설정 카드 */}
                <div className="bg-white rounded-3xl shadow-2xl p-5 mb-6 w-full mt-4">
                    {/* 그룹명 입력 */}
                    <div className="flex items-center text-lg text-purple-600 font-bold mb-3">
                        <UsersRound className="w-5 h-5 mr-1.5" />
                        그룹명
                    </div>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full px-6 py-4 bg-purple-50 border-2 border-purple-100 rounded-2xl text-purple-700 placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all font-jua text-xl shadow-inner"
                        placeholder="그룹명을 입력해주세요 (예: 햇살반)"
                        maxLength={15}
                    />
                </div>

                {/* 사진 업로드 카드 */}
                <div className="bg-white rounded-3xl shadow-2xl p-5 mb-6 w-full">
                    {/* 타이틀 영역 & 전체삭제 */}
                    <div className="flex items-center justify-between mb-3">

                        <div className="flex items-center text-lg text-purple-600 font-bold">
                            <ImageUp className="w-5 h-5 mr-1.5" />
                            사진 업로드
                        </div>

                        {/* 사진이 있을 때만 삭제 버튼 표시 */}
                        {uploadedFiles.length > 0 && (
                            <button
                                // onClick={handleResetUpload}
                                className="flex items-center px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 rounded-xl cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                전체 삭제
                            </button>
                        )}
                    </div>

                    {/* 사진 영역 */}
                    <div>
                        {/* 실제 인풋 (숨김) */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept="image/*"
                            className="hidden"
                        />

                        {/* 업로드 영역 (미리보기) */}
                        <div className="flex rounded-2xl p-3 border-4 border-dashed border-purple-500 bg-purple-50 min-h-[300px]">
                            {uploadedFiles.length === 0 ? (
                                // 업로드된 사진이 없을때
                                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer w-full flex flex-col items-center justify-center">
                                    <ImagePlus className="w-16 h-16 text-purple-400 mb-4" />
                                    <p className="text-lg text-purple-600 font-bold">사진을 선택하세요</p>
                                    {/* <p className="text-sm text-gray-500 mt-2">클릭하거나 드래그해서 업로드</p> */}
                                </div>
                            ) : (
                                //업로드 된 사진이 있을떄
                                <div className="w-full flex flex-wrap justify-center gap-4 max-h-80 overflow-y-auto p-1">
                                    {uploadedFiles.map((fileItem, index) => (
                                        <div key={index} className="group relative w-[30%] min-w-[110px] max-w-[160px] bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-md transition-all duration-300 flex flex-col">
                                            <div className="relative aspect-square overflow-hidden bg-gray-50">
                                                <img src={fileItem.image} alt={fileItem.kidName} className="w-full h-full object-cover" />
                                                <div className="absolute top-1.5 right-1.5 z-10">
                                                    <button onClick={() => removeFileByIndex(index)} className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all active:scale-90">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-white border-t border-purple-50">
                                                <input
                                                    type="text"
                                                    value={fileItem.kidName}
                                                    onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                                    className={`w-full bg-gray-50 border text-[11px] text-center py-1.5 px-1 rounded-lg outline-none transition-all font-bold text-gray-700 }`}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {/* 사진 추가 버튼 카드 */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative w-[30%] min-w-[110px] max-w-[160px] aspect-square bg-purple-50/50 rounded-2xl border-2 border-dashed border-purple-200/60 hover:border-purple-400 hover:bg-purple-100/80 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 pt-[22px] pb-[22px]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/40 border border-white/20 flex items-center justify-center shadow-sm backdrop-blur-[2px] group-hover:scale-110 group-hover:bg-white/60 transition-all duration-300">
                                            <Plus className="w-7 h-7 text-purple-500/80 group-hover:text-purple-600" />
                                        </div>
                                        <span className="mt-6 text-[11px] font-bold text-purple-400 group-hover:text-purple-600 transition-colors">사진 추가</span>
                                    </div>

                                </div>
                            )}

                        </div>

                        {/* 저장 버튼 */}
                        {uploadedFiles.length > 0 &&
                            <ChunkyButton onClick={handleFileSave} icon={Save} size="lg" className="w-full mt-4" variant="secondary" disabled={isUploading}>

                                {isUploading ? "저장중..." : `${uploadedFiles.length}명 저장하기`}
                            </ChunkyButton>
                        }
                    </div>
                </div>

                {/* 저장된 친구들 목록 카드 */}
                <div className="bg-white rounded-3xl shadow-2xl p-5 mb-6 w-full">
                    <div className="flex items-center justify-between mb-3">

                        <div className="flex items-center gap-1.5 text-lg text-purple-600 font-bold">
                            <Folder className="w-5 h-5" />
                            저장된 친구들
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-400 text-[11px] font-bold rounded-full border border-purple-100 mt-0.5">
                                총 <span className="text-purple-600">{kids?.length}</span>명
                            </span>
                        </div>

                        {/* {savedChildren.length > 0 && (
                            <button
                                onClick={handleResetSavedAll}
                                className="flex items-center px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 rounded-xl cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                전체 삭제
                            </button>
                        )} */}
                    </div>

                    {kids ? (
                        <div className="flex flex-wrap gap-4 justify-start">
                            {kids.map(kid =>
                                <KidCard key={kid.id} kid={kid} />
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">아직 저장된 친구가 없어요</p>
                    )}
                </div>
            </main>

        </div>
    );
}