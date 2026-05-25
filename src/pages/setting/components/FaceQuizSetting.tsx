import { useEffect, useRef, useState } from "react";
import { UsersRound, ImageUp, Trash2, Folder, Plus, Save, SquarePen, SmilePlus, ScanFace, Loader2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ChunkyButton from "../../../components/ChunkyButton";
import KidCard from "../../../components/KidCard";
import * as faceapi from 'face-api.js';
import { FaceQuizItemRepository } from "../../../repositories/FaceQuizItemRepository";
import type { FacePartBox } from "../../../db";

export type AnalysisStatus = null | 'ready' | 'success' | 'fail';

interface UploadedFile {
    file: File;
    kidName: string;
    analysisStatus?: AnalysisStatus;
    analysisData?: any;
}

const MAX_LENGTH = 15;

// const toPercentBox = (points: { x: number; y: number }[], imgW: number, imgH: number): FacePartBox => {
//     const xs = points.map(p => p.x);
//     const ys = points.map(p => p.y);

//     const minX = Math.min(...xs);
//     const maxX = Math.max(...xs);
//     const minY = Math.min(...ys);
//     const maxY = Math.max(...ys);

//     return {
//         x: (minX / imgW) * 100,
//         y: (minY / imgH) * 100,
//         w: ((maxX - minX) / imgW) * 100,
//         h: ((maxY - minY) / imgH) * 100,
//     };
// };

const toPercentBox = (
    points: { x: number; y: number }[],
    imgW: number,
    imgH: number
): FacePartBox => {

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // 픽셀 기준 패딩
    const padding = 10;

    return {
        x: ((minX - padding) / imgW) * 100,
        y: ((minY - padding) / imgH) * 100,
        w: ((maxX - minX + padding * 2) / imgW) * 100,
        h: ((maxY - minY + padding * 2) / imgH) * 100,
    };
};

export default function FaceQuizSetting() {

    // 업로드한 파일
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    // 이미지 드래그 앤 드롭
    const [isDragging, setIsDragging] = useState(false);
    // 파일 업로드중
    const [isUploading, setIsUploading] = useState(false);
    // 업로드한 파일 db에 저장중
    const [isSaving, setIsSaving] = useState(false);

    // 얼굴 분석 진행 관련 상태
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalysisDone, setIsAnalysisDone] = useState(false);
    const [analyzeProgress, setAnalyzeProgress] = useState({ current: 0, total: 0, success: 0, fail: 0 });

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
        const data = await FaceQuizItemRepository.findAll();
        setKids(data || []);
        setIsLoading(false);
    };

    // 이름 변경 (리액트 상태만 업데이트)
    const handleNameChange = (id: number, newName: string) => {
        setKids(prev => prev.map(k => k.id === id ? { ...k, kidName: newName } : k));
    };

    // 일괄 저장 (이때만 DB에 반영)
    const handleSaveAll = async () => {
        const hasEmptyName = kids.some(kid => kid.kidName.trim() === "");

        if (hasEmptyName) {
            toast.error("모든 아이들의 이름을 입력해주세요!");
            return;
        }

        try {
            await Promise.all(kids.map(k => FaceQuizItemRepository.updateKidName(k.id, k.kidName.trim())));
            toast.success("모든 변경사항이 저장되었습니다!");
            setIsEditMode(false);
        } catch (error) {
            toast.error("저장 중 오류가 발생했습니다.");
        }
    };

    // 삭제 (즉시 DB 반영 + 상태 반영)
    const removeKidById = async (id: number, name: string) => {
        const result = await deleteConfirm(name, "친구를 삭제할까요?");

        if (!result.isConfirmed) return;

        try {
            await FaceQuizItemRepository.delete(id);
            setKids(prev => prev.filter(k => k.id !== id));
            toast.success(`${name}(이)가 성공적으로 삭제되었습니다.`);
        } catch (error) {
            console.error("삭제 실패:", error);
            toast.error("삭제 중 오류가 발생했습니다.");
        }
    };

    const removeAllKids = async () => {
        const result = await deleteConfirm("전체 삭제", "지금 저장된 모든 친구들을 삭제하시겠어요?");

        if (!result.isConfirmed) return;

        try {
            await FaceQuizItemRepository.deleteAll();
            loadKids();
            toast.success("모든 데이터가 성공적으로 삭제되었습니다.");
        } catch (error) {
            console.error("전체 삭제 실패:", error);
            toast.error("삭제 중 오류가 발생했습니다.");
        }
    };

    // 1. 파일 선택 시 실행
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSaving || isUploading || isAnalyzing) return;

        if (e.target.files?.length) {
            appendUploadedFiles(e.target.files);
        }

        if (e.target.value) e.target.value = '';
    };

    // [추가] 2-1. 얼굴 분석하기 로직
    const handleAnalyzeFaces = async () => {
        if (uploadedFiles.length === 0) return;

        const hasEmptyName = uploadedFiles.some(file => file.kidName.trim() === "");
        if (hasEmptyName) {
            toast.error("모든 아이들의 이름을 입력해주세요!");
            return;
        }

        setIsAnalyzing(true);
        setIsAnalysisDone(false);
        setAnalyzeProgress({ current: 0, total: uploadedFiles.length, success: 0, fail: 0 });

        try {
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

            let successCount = 0;
            let failCount = 0;
            const updatedFiles = [...uploadedFiles];

            // 순차적으로 이미지 분석
            for (let i = 0; i < updatedFiles.length; i++) {

                const fileObj = updatedFiles[i];
                setAnalyzeProgress(prev => ({ ...prev, current: i + 1 }));
                fileObj.analysisStatus = 'ready';


                try {
                    // File 객체를 image 요소로 변환하여 faceapi에 전달
                    const img = await faceapi.bufferToImage(fileObj.file);
                    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks();

                    if (detection) {
                        successCount++;
                        updatedFiles[i].analysisStatus = 'success';
                        // 옛날 코드 형식대로 좌표 정보 저장
                        const imgW = img.width;
                        const imgH = img.height;

                        updatedFiles[i].analysisData = {
                            kidName: fileObj.kidName,
                            fileName: fileObj.file.name,
                            image: fileObj.file,
                            createdAt: Date.now(),

                            leftEye: toPercentBox(detection.landmarks.getLeftEye(), imgW, imgH),
                            rightEye: toPercentBox(detection.landmarks.getRightEye(), imgW, imgH),
                            nose: toPercentBox(detection.landmarks.getNose(), imgW, imgH),
                            mouth: toPercentBox(detection.landmarks.getMouth(), imgW, imgH),
                        };
                    } else {
                        failCount++;
                        updatedFiles[i].analysisStatus = 'fail';
                    }
                } catch (err) {
                    failCount++;
                    updatedFiles[i].analysisStatus = 'fail';
                }

                // 중간 진행률 업데이트
                setAnalyzeProgress(prev => ({ ...prev, success: successCount, fail: failCount }));
                setUploadedFiles([...updatedFiles]);
            }

            setIsAnalysisDone(true);
            if (successCount === 0) {
                toast.error("얼굴 분석에 성공한 사진이 없습니다.");
            }

        } catch (error) {
            console.error("얼굴 분석 에러:", error);
            toast.dismiss("modelLoad");
            toast.error("분석 중 오류가 발생했습니다. 모델 파일을 확인해주세요.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // [수정] 2-2. 분석 완료 후 최종 저장 시 실행 (기존 handleFileSave를 대체)
    const handleFinalSave = async () => {
        if (isSaving || isUploading || isAnalyzing) return;

        // 성공한 파일만 필터링
        const successFiles = uploadedFiles.filter(f => f.analysisStatus === 'success');
        if (successFiles.length === 0) {
            toast.error("저장할 분석 완료 사진이 없습니다.");
            return;
        }

        setIsSaving(true);
        setIsLoading(true);

        try {

            await Promise.all(
                successFiles.map((fileObj) => {
                    return FaceQuizItemRepository.add(
                        fileObj.kidName,
                        fileObj.file,
                        fileObj.analysisData.leftEye,
                        fileObj.analysisData.rightEye,
                        fileObj.analysisData.nose,
                        fileObj.analysisData.mouth
                    );
                })
            );

            await loadKids();
            toast.success(`${successFiles.length}명의 데이터가 성공적으로 저장되었습니다!`);

        } catch (error) {
            console.error(error);
            toast.error("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
            setIsLoading(false);
            setUploadedFiles([]);
            setIsAnalyzing(false);
            setIsAnalysisDone(false);
        }
    };

    const updateFileNameByIndex = (indexToUpdate: number, newName: string) => {
        setUploadedFiles(prev =>
            prev.map((file, index) =>
                index === indexToUpdate
                    ? { ...file, kidName: newName }
                    : file
            )
        );
    };

    const removeFileByIndex = (indexToRemove: number) => {
        setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const removeAllFiles = () => {
        if (isSaving || isUploading || isAnalyzing) return;

        setUploadedFiles([]);
        setIsSaving(false);
        setIsUploading(false);
        setIsAnalysisDone(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 드래그 영역 이벤트들...
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (isSaving || isUploading || isAnalyzing || isAnalysisDone) return;

        if (e.dataTransfer.files?.length) {
            appendUploadedFiles(e.dataTransfer.files);
        }
    };

    //업로드 파일 추가함수 (클릭, 드래그 둘 다 사용)
    const appendUploadedFiles = async (files: FileList | File[]) => {
        setIsUploading(true);
        setIsAnalysisDone(false);

        try {
            const newFiles: UploadedFile[] = await Promise.all(
                Array.from(files)
                    .filter(file => file.type.startsWith('image/'))
                    .map(async (file) => {
                        const resizedFile = await resizeImage(file);
                        const normalizedFileName = file.name.normalize('NFC');
                        const defaultName = normalizedFileName.split('.').slice(0, -1).join('.') || file.name;

                        return {
                            file: resizedFile,
                            kidName: defaultName.slice(0, MAX_LENGTH),
                            analysisStatus: null //기본 상태 세팅
                        };
                    })
            );

            setUploadedFiles(prev => [...prev, ...newFiles]);
            toast.success("사진 업로드 성공!");
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            toast.error("사진 업로드 중 오류가 발생했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    //삭제 컨펌 함수
    const deleteConfirm = async (title: string, text: string) => {
        return await Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            customClass: {
                popup: '!rounded-4xl !p-4 md:!p-5 !shadow-2xl !border-4 !border-purple-100 !w-[90%] !max-w-lg',
                title: '!text-xl md:!text-3xl !font-black !text-purple-800',
                htmlContainer: '!text-gray-600 !font-medium !text-md md:!text-xl',
                actions: '!mt-10',
                confirmButton: 'px-10 py-3 rounded-2xl font-bold bg-purple-500 text-white mx-1 hover:bg-purple-600 transition-all active:scale-95 cursor-pointer',
                cancelButton: 'px-10 py-3 rounded-2xl font-bold bg-slate-200 text-slate-600 mx-1 hover:bg-slate-300 transition-all active:scale-95 cursor-pointer',
            },
            buttonsStyling: false,
        });
    }

    // 이미지 사이즈 조절 및 압축 함수
    const resizeImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const SIZE = 512;
                    canvas.width = SIZE;
                    canvas.height = SIZE;
                    const ctx = canvas.getContext("2d");

                    let sourceX = 0;
                    let sourceY = 0;
                    let sourceWidth = img.width;
                    let sourceHeight = img.height;

                    if (img.width > img.height) {
                        sourceWidth = img.height;
                        sourceX = (img.width - img.height) / 2;
                    } else {
                        sourceHeight = img.width;
                        sourceY = (img.height - img.width) / 2;
                    }

                    ctx?.drawImage(
                        img,
                        sourceX, sourceY, sourceWidth, sourceHeight,
                        0, 0, SIZE, SIZE
                    );

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], file.name, {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            });
                            resolve(resizedFile);
                        }
                    }, "image/jpeg", 0.8);
                };
            };
        });
    };

    return (
        <>
            {/* 사진 업로드 카드 */}
            <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-5 mt-4 mb-6 w-full">
                {/* 타이틀 영역 & 전체삭제 */}
                <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-2">
                        <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
                            <SmilePlus className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        <div className="text-purple-800 font-bold text-lg md:text-xl">
                            얼굴 퀴즈 친구 추가
                        </div>
                    </div>

                    {uploadedFiles.length > 0 && !isSaving && !isUploading && !isAnalyzing && (
                        <ChunkyButton onClick={removeAllFiles} size="xs" variant="error" icon={Trash2}>
                            <span className="hidden sm:inline">전체 삭제</span>
                            <span className="inline sm:hidden">전체</span>
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
                {isUploading ?
                    <div className="relative rounded-3xl p-3 border-3  md:border-4 border-dashed h-[250px] md:h-[300px] flex flex-col items-center justify-center group overflow-hidden bg-white border-purple-300">
                        <div className="absolute inset-0 bg-gradient-to-b transition-all duration-500 from-purple-50 to-white" />
                        <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                            <div className="relative">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-50 rounded-[2rem] flex items-center justify-center shadow-xl shadow-purple-100">
                                    <ImageUp className="w-10 h-10 md:w-12 md:h-12 text-purple-500" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-lg md:text-2xl font-black text-purple-600 animate-pulse">
                                    사진 업로드 중
                                </p>
                                <div className="flex items-center justify-center gap-1.5">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    uploadedFiles.length > 0 ?
                        <div
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className="rounded-3xl p-3 transition-all border-2 border-purple-100 bg-white shadow-inner max-h-[60vh] overflow-y-auto block scrollbar-hide"
                        >
                            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {uploadedFiles.map((uploadedFile, index) => (
                                    // [참고] KidCard 쪽에 성공/실패 시각적 표시를 원하신다면 status prop 등을 전달하여 수정할 수도 있습니다.
                                    <KidCard
                                        key={`file-${index}`}
                                        kidName={uploadedFile.kidName}
                                        image={uploadedFile.file}
                                        onRemove={() => removeFileByIndex(index)}
                                        onNameChange={(newName) => updateFileNameByIndex(index, newName)}
                                        isEditMode={!isSaving && !isAnalyzing && !isAnalysisDone}
                                        maxLength={MAX_LENGTH}
                                        analysisStatus={uploadedFile.analysisStatus}
                                    />
                                ))}

                                {/* 사진 추가 버튼 카드 */}
                                {!isSaving && !isAnalyzing && !isAnalysisDone &&
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="min-h-50 bg-purple-50/50 rounded-2xl border-2 border-dashed border-purple-200/60 hover:border-purple-400 hover:bg-purple-100/80 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 pt-[22px] pb-[22px]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/40 border border-white/20 flex items-center justify-center shadow-sm backdrop-blur-[2px] group-hover:scale-110 group-hover:bg-white/60 transition-all duration-300">
                                            <Plus className="w-7 h-7 text-purple-500/80 group-hover:text-purple-600" />
                                        </div>
                                        <span className="mt-6 text-[11px] font-bold text-purple-400 group-hover:text-purple-600 transition-colors">사진 추가</span>
                                    </div>
                                }
                            </div>
                        </div>
                        :
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative rounded-3xl p-3 transition-all duration-500 border-3  md:border-4 border-dashed h-[250px] md:h-[300px] flex flex-col items-center justify-center group overflow-hidden cursor-pointer
                                ${isDragging ? "bg-white border-purple-300" : "border-slate-200 bg-slate-50/30 hover:bg-white hover:border-purple-300 "}
                                `}
                        >
                            <div
                                className={`pointer-events-none absolute inset-0 bg-gradient-to-b transition-all duration-500
                                        ${isDragging
                                        ? "from-purple-50 to-white"
                                        : "from-purple-100/0 to-purple-100/0 group-hover:from-purple-50 group-hover:to-white"
                                    }
                                `}
                            />
                            <div className="pointer-events-none relative z-10 w-full h-full flex flex-col items-center justify-center">
                                <div
                                    className={`w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem]
                                                flex items-center justify-center mb-6 md:mb-8 transition-all duration-500 ease-out
                                                ${isDragging
                                            ? "scale-110 -translate-y-3 rotate-3 shadow-2xl shadow-purple-200"
                                            : "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] group-hover:scale-110 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-purple-200 group-hover:rotate-3"
                                        }
                                        `}
                                >
                                    <ImageUp
                                        className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-500
                                                ${isDragging
                                                ? "text-purple-500"
                                                : "text-slate-400 group-hover:text-purple-500"
                                            }
                                            `}
                                    />
                                </div>

                                <div className="text-center space-y-2">
                                    <p
                                        className={`text-lg md:text-2xl font-black transition-colors duration-500 tracking-tight
                                                ${isDragging ? "text-purple-600" : "text-slate-400 group-hover:text-purple-600"}
                                            `}
                                    >
                                        친구 사진을 추가해 주세요
                                    </p>

                                    <p
                                        className={`text-sm font-bold italic transition-colors duration-500
                                                ${isDragging ? "text-purple-300" : "text-slate-300 group-hover:text-purple-300"}
                                            `}
                                    >
                                        - 여기에 클릭 또는 드래그 -
                                    </p>
                                </div>
                            </div>
                        </div>
                }

                {/* 1. 사진이 있고 아직 분석 전일 경우: "N명 얼굴 분석하기" 버튼 */}
                {uploadedFiles.length > 0 && !isUploading && !isAnalyzing && !isAnalysisDone && (
                    <ChunkyButton onClick={handleAnalyzeFaces} icon={ScanFace} size="lg" className="w-full mt-4" variant="secondary" disabled={isSaving}>
                        {uploadedFiles.length}명 얼굴 분석하기
                    </ChunkyButton>
                )}

                {/* 2. 분석 중 프로그레스 바 UI */}
                {(isAnalyzing || isAnalysisDone) && (
                    <div className="mt-4 p-4 text-left bg-purple-50 rounded-2xl border border-purple-100 shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-purple-600 font-jua flex items-center gap-2">
                                {isAnalyzing ?
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        눈 코 입 AI 분석 중...
                                    </>
                                    :
                                    <>
                                        모든 사진 분석 완료
                                    </>
                                }
                            </span>
                            <span className="text-xs font-bold text-gray-400 font-mono">
                                {analyzeProgress.current} / {analyzeProgress.total}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                            <div
                                className="bg-purple-600 h-full transition-all duration-300 shadow-sm"
                                style={{ width: `${(analyzeProgress.current / analyzeProgress.total) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex gap-4 mt-3 justify-center border-t border-purple-100 pt-2.5 font-jua">
                            <span className="text-base font-bold text-green-500 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> 성공: {analyzeProgress.success}
                            </span>
                            <span className="text-base font-bold text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> 실패: {analyzeProgress.fail}
                            </span>
                        </div>
                    </div>
                )}

                {/* 3. 분석 완료 후 최종 결과 버튼 */}
                {isAnalysisDone && (
                    analyzeProgress.success > 0 ? (
                        <ChunkyButton onClick={handleFinalSave} icon={Save} size="lg" className="w-full mt-4" variant="success" disabled={isSaving}>
                            {analyzeProgress.success}명 저장하기
                        </ChunkyButton>
                    ) : (
                        <ChunkyButton onClick={removeAllFiles} icon={RefreshCcw} size="lg" className="w-full mt-4" variant="error" disabled={isSaving}>
                            다른 사진으로 시도하기
                        </ChunkyButton>
                    )
                )}

                {/* 저장된 친구들 목록 카드 */}
                <div className="flex items-center justify-between mb-5 mt-10">

                    <div className="flex items-center gap-2">
                        <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
                            <Folder className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        <div className="text-purple-800 font-bold text-lg md:text-xl">
                            저장된 친구들
                        </div>
                        <div className="px-3 py-1 bg-purple-50 text-purple-500 text-xs font-black rounded-full border border-purple-100 flex items-center gap-1">
                            <span className="text-purple-700 text-xs md:text-sm">{kids.length}</span>
                            <span className="opacity-60">명</span>
                        </div>
                    </div>

                    {kids.length > 0 && (
                        isEditMode ? (
                            <div className="hidden sm:flex gap-2">
                                <ChunkyButton onClick={removeAllKids} size="xs" variant="error" icon={Trash2}>
                                    전체 삭제
                                </ChunkyButton>
                                <ChunkyButton onClick={handleSaveAll} size="xs" variant="success" icon={Save}>
                                    저장 하기
                                </ChunkyButton>
                            </div>
                        ) : (
                            <ChunkyButton onClick={() => setIsEditMode(true)} size="xs" variant="secondary" icon={SquarePen}>
                                <span className="hidden sm:inline">수정 하기</span>
                                <span className="inline sm:hidden">수정</span>
                            </ChunkyButton>
                        )
                    )}
                </div>

                <div>
                    {kids.length > 0 && isEditMode && (
                        <div className="flex gap-2 sm:hidden mb-5 w-full justify-end">
                            <ChunkyButton onClick={removeAllKids} size="xs" variant="error" icon={Trash2}>
                                전체 삭제
                            </ChunkyButton>
                            <ChunkyButton onClick={handleSaveAll} size="xs" variant="success" icon={Save}>
                                저장 하기
                            </ChunkyButton>
                        </div>
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
                            <p className="text-lg md:text-xl font-bold text-gray-400">아직 저장된 친구가 없어요</p>
                        </div>
                    )}
            </div>
        </>
    );
}