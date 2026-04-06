import { useRef, useState, type ChangeEvent } from "react";
import SubHeader from "../components/SubHeader";
import {
    Cloud, Sun, Flower, Pencil, Baby, Palette, Music,
    ArrowLeft, Home, ChevronLeft, UsersRound, MessageCircleMore,
    ImageUp, Trash2, ImagePlus, ScanFace, CheckCircle2, AlertCircle, Folder
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

// 타입 정의 (필요에 따라 확장하세요)
interface SavedChild {
    id: string;
    name: string;
    imageUrl: string;
}

export default function SettingPage() {

    // 상태 관리
    const [groupName, setGroupName] = useState('');
    const [userTitle, setUserTitle] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [savedChildren, setSavedChildren] = useState<SavedChild[]>([]);

    // 분석 진행 상태
    const [progress, setProgress] = useState({ current: 0, total: 0, success: 0, fail: 0 });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    // 뒤로가기 / 홈 이동 핸들러
    const goHome = () => {
        navigate('/', { replace: true });
    };

    // 파일 선택 핸들러
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);

            // 미리보기 URL 생성
            const urls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
        }
    };

    // 업로드 초기화 핸들러
    const handleResetUpload = () => {
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // 전체 삭제 핸들러
    const handleResetSavedAll = () => {
        if (window.confirm('저장된 친구들 목록을 모두 삭제하시겠습니까?')) {
            setSavedChildren([]);
        }
    };

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
                        placeholder="예: 햇살반 친구들, 1학년 3반"
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
                        {selectedFiles.length > 0 && (
                            <button
                                onClick={handleResetUpload}
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
                            id="photo-input"
                        />

                        {/* 업로드 영역 (미리보기) */}
                        <div className="flex rounded-2xl p-3 border-4 border-dashed border-purple-500 bg-purple-50 min-h-[300px]">
                            <label
                                htmlFor="photo-input"
                                className="cursor-pointer w-full flex flex-col items-center justify-center"
                            >
                                {previewUrls.length === 0 ? (
                                    // 업로드된 사진이 없을때
                                    <>
                                        <ImagePlus className="w-16 h-16 text-purple-400 mb-4" />
                                        <p className="text-lg text-purple-600 font-bold">사진을 선택하세요</p>
                                        {/* <p className="text-sm text-gray-500 mt-2">클릭하거나 드래그해서 업로드</p> */}
                                    </>
                                ) : (
                                    //업로드 된 사진이 있을떄
                                    <div className="w-full flex flex-wrap justify-center gap-4 max-h-80 overflow-y-auto p-1">
                                        {previewUrls.map((url, idx) => (
                                            <img
                                                key={idx}
                                                src={url}
                                                alt={`preview-${idx}`}
                                                className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-white"
                                            />
                                        ))}
                                    </div>
                                )}
                            </label>
                        </div>

                    </div>
                </div>

                {/* 저장된 친구들 목록 카드 */}
                <div className="bg-white rounded-3xl shadow-2xl p-5 mb-6 w-full">
                    <div className="flex items-center justify-between mb-3">

                        <div className="flex items-center gap-1.5 text-lg text-purple-600 font-bold">
                            <Folder className="w-5 h-5" />
                            저장된 친구들
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-400 text-[11px] font-bold rounded-full border border-purple-100 mt-0.5">
                                총 <span className="text-purple-600">{savedChildren.length}</span>명
                            </span>
                        </div>

                        {savedChildren.length > 0 && (
                            <button
                                onClick={handleResetSavedAll}
                                className="flex items-center px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 rounded-xl cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                전체 삭제
                            </button>
                        )}
                    </div>

                    {savedChildren.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">아직 저장된 친구가 없어요</p>
                    ) : (
                        <div className="flex flex-wrap gap-4 justify-start">
                            {/* 여기에 저장된 아이들 렌더링 (예시 컴포넌트 구조) */}
                            {/* {savedChildren.map(child => ( ... ))} */}
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
}