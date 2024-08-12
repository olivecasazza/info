; ModuleID = 'probe1.4fbd043df9ae1f40-cgu.0'
source_filename = "probe1.4fbd043df9ae1f40-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

%"core::fmt::rt::Argument<'_>" = type { %"core::fmt::rt::ArgumentType<'_>" }
%"core::fmt::rt::ArgumentType<'_>" = type { [1 x i32], ptr }

@alloc_8df0580a595a87d56789d20c7318e185 = private unnamed_addr constant <{ [166 x i8] }> <{ [166 x i8] c"unsafe precondition(s) violated: ptr::copy_nonoverlapping requires that both pointer arguments are aligned and non-null and the specified memory ranges do not overlap" }>, align 1
@alloc_fad0cd83b7d1858a846a172eb260e593 = private unnamed_addr constant <{ [42 x i8] }> <{ [42 x i8] c"is_aligned_to: align is not a power-of-two" }>, align 1
@alloc_b498cf0a06cafe1ad822ab5dde97c8c0 = private unnamed_addr constant <{ ptr, [4 x i8] }> <{ ptr @alloc_fad0cd83b7d1858a846a172eb260e593, [4 x i8] c"*\00\00\00" }>, align 4
@0 = private unnamed_addr constant <{ [4 x i8], [4 x i8] }> <{ [4 x i8] zeroinitializer, [4 x i8] undef }>, align 4
@alloc_cb997dea4c2e7a717d0b6d0a18915ef9 = private unnamed_addr constant <{ [81 x i8] }> <{ [81 x i8] c"/rustc/3f5fd8dd41153bc5fdca9427e9e05be2c767ba23/library/core/src/ptr/const_ptr.rs" }>, align 1
@alloc_0cb02a4ed03d03a38de6e4c5fa52bcef = private unnamed_addr constant <{ ptr, [12 x i8] }> <{ ptr @alloc_cb997dea4c2e7a717d0b6d0a18915ef9, [12 x i8] c"Q\00\00\00\86\06\00\00\0D\00\00\00" }>, align 4
@alloc_ffc44ed1670ebf78d81555edceff65f6 = private unnamed_addr constant <{ [69 x i8] }> <{ [69 x i8] c"unsafe precondition(s) violated: usize::unchecked_mul cannot overflow" }>, align 1
@alloc_d4d2a2a8539eafc62756407d946babb3 = private unnamed_addr constant <{ [110 x i8] }> <{ [110 x i8] c"unsafe precondition(s) violated: ptr::read_volatile requires that the pointer argument is aligned and non-null" }>, align 1
@alloc_20b3d155afd5c58c42e598b7e6d186ef = private unnamed_addr constant <{ [93 x i8] }> <{ [93 x i8] c"unsafe precondition(s) violated: NonNull::new_unchecked requires that the pointer is non-null" }>, align 1
@alloc_5b1eefa0b2e53e9e01795a1b97dd162e = private unnamed_addr constant <{ [80 x i8] }> <{ [80 x i8] c"/rustc/3f5fd8dd41153bc5fdca9427e9e05be2c767ba23/library/core/src/alloc/layout.rs" }>, align 1
@alloc_8433b83260b07f87ec151c668c14e66d = private unnamed_addr constant <{ ptr, [12 x i8] }> <{ ptr @alloc_5b1eefa0b2e53e9e01795a1b97dd162e, [12 x i8] c"P\00\00\00\C3\01\00\00)\00\00\00" }>, align 4
@alloc_763310d78c99c2c1ad3f8a9821e942f3 = private unnamed_addr constant <{ [61 x i8] }> <{ [61 x i8] c"is_nonoverlapping: `size_of::<T>() * count` overflows a usize" }>, align 1
@__rust_no_alloc_shim_is_unstable = external dso_local global i8
@alloc_68ac15728a1e6ba4743b718936db7fdf = private unnamed_addr constant <{ ptr, [4 x i8] }> <{ ptr inttoptr (i32 1 to ptr), [4 x i8] zeroinitializer }>, align 4
@alloc_83ea17bf0c4f4a5a5a13d3ae7955acd0 = private unnamed_addr constant <{ [4 x i8] }> zeroinitializer, align 4

; core::intrinsics::copy_nonoverlapping::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core10intrinsics19copy_nonoverlapping18precondition_check17hbccae9224de1e6dfE(ptr %src, ptr %dst, i32 %size, i32 %align, i32 %count) unnamed_addr #0 {
start:
  %0 = alloca [4 x i8], align 4
  %1 = alloca [4 x i8], align 4
  %_23 = alloca [24 x i8], align 4
  %_14 = alloca [24 x i8], align 4
  %_12 = ptrtoint ptr %src to i32
  %2 = icmp eq i32 %_12, 0
  br i1 %2, label %bb8, label %bb9

bb8:                                              ; preds = %start
  br label %bb6

bb9:                                              ; preds = %start
  %3 = call i32 @llvm.ctpop.i32(i32 %align)
  store i32 %3, ptr %1, align 4
  %_15 = load i32, ptr %1, align 4
  %4 = icmp eq i32 %_15, 1
  br i1 %4, label %bb10, label %bb11

bb6:                                              ; preds = %bb10, %bb8
  br label %bb7

bb10:                                             ; preds = %bb9
  %_19 = sub i32 %align, 1
  %_18 = and i32 %_12, %_19
  %_6 = icmp eq i32 %_18, 0
  br i1 %_6, label %bb1, label %bb6

bb11:                                             ; preds = %bb9
  store ptr @alloc_b498cf0a06cafe1ad822ab5dde97c8c0, ptr %_14, align 4
  %5 = getelementptr inbounds i8, ptr %_14, i32 4
  store i32 1, ptr %5, align 4
  %6 = load ptr, ptr @0, align 4
  %7 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  %8 = getelementptr inbounds i8, ptr %_14, i32 16
  store ptr %6, ptr %8, align 4
  %9 = getelementptr inbounds i8, ptr %8, i32 4
  store i32 %7, ptr %9, align 4
  %10 = getelementptr inbounds i8, ptr %_14, i32 8
  store ptr inttoptr (i32 4 to ptr), ptr %10, align 4
  %11 = getelementptr inbounds i8, ptr %10, i32 4
  store i32 0, ptr %11, align 4
; call core::panicking::panic_fmt
  call void @_ZN4core9panicking9panic_fmt17hb859252f4b513814E(ptr align 4 %_14, ptr align 4 @alloc_0cb02a4ed03d03a38de6e4c5fa52bcef) #10
  unreachable

bb1:                                              ; preds = %bb10
  %_21 = ptrtoint ptr %dst to i32
  %12 = icmp eq i32 %_21, 0
  br i1 %12, label %bb13, label %bb14

bb7:                                              ; preds = %bb4, %bb5, %bb6
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17haa2a70e6d322fa1bE(ptr align 1 @alloc_8df0580a595a87d56789d20c7318e185, i32 166) #10
  unreachable

bb13:                                             ; preds = %bb1
  br label %bb5

bb14:                                             ; preds = %bb1
  %13 = call i32 @llvm.ctpop.i32(i32 %align)
  store i32 %13, ptr %0, align 4
  %_24 = load i32, ptr %0, align 4
  %14 = icmp eq i32 %_24, 1
  br i1 %14, label %bb15, label %bb16

bb5:                                              ; preds = %bb15, %bb13
  br label %bb7

bb15:                                             ; preds = %bb14
  %_28 = sub i32 %align, 1
  %_27 = and i32 %_21, %_28
  %_7 = icmp eq i32 %_27, 0
  br i1 %_7, label %bb2, label %bb5

bb16:                                             ; preds = %bb14
  store ptr @alloc_b498cf0a06cafe1ad822ab5dde97c8c0, ptr %_23, align 4
  %15 = getelementptr inbounds i8, ptr %_23, i32 4
  store i32 1, ptr %15, align 4
  %16 = load ptr, ptr @0, align 4
  %17 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  %18 = getelementptr inbounds i8, ptr %_23, i32 16
  store ptr %16, ptr %18, align 4
  %19 = getelementptr inbounds i8, ptr %18, i32 4
  store i32 %17, ptr %19, align 4
  %20 = getelementptr inbounds i8, ptr %_23, i32 8
  store ptr inttoptr (i32 4 to ptr), ptr %20, align 4
  %21 = getelementptr inbounds i8, ptr %20, i32 4
  store i32 0, ptr %21, align 4
; call core::panicking::panic_fmt
  call void @_ZN4core9panicking9panic_fmt17hb859252f4b513814E(ptr align 4 %_23, ptr align 4 @alloc_0cb02a4ed03d03a38de6e4c5fa52bcef) #10
  unreachable

bb2:                                              ; preds = %bb15
; call core::ub_checks::is_nonoverlapping::runtime
  %_9 = call zeroext i1 @_ZN4core9ub_checks17is_nonoverlapping7runtime17hf12dc3737f413ed6E(ptr %src, ptr %dst, i32 %size, i32 %count) #11
  br i1 %_9, label %bb3, label %bb4

bb4:                                              ; preds = %bb2
  br label %bb7

bb3:                                              ; preds = %bb2
  ret void
}

; core::intrinsics::unlikely
; Function Attrs: nounwind
define internal zeroext i1 @_ZN4core10intrinsics8unlikely17habda6e705aa3ca0fE(i1 zeroext %b) unnamed_addr #1 {
start:
  ret i1 %b
}

; core::fmt::Arguments::new_v1
; Function Attrs: inlinehint nounwind
define dso_local void @_ZN4core3fmt9Arguments6new_v117h2469593e1d413ab0E(ptr sret([24 x i8]) align 4 %_0, ptr align 4 %pieces, ptr align 4 %args) unnamed_addr #0 {
start:
  store ptr %pieces, ptr %_0, align 4
  %0 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 1, ptr %0, align 4
  %1 = load ptr, ptr @0, align 4
  %2 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  %3 = getelementptr inbounds i8, ptr %_0, i32 16
  store ptr %1, ptr %3, align 4
  %4 = getelementptr inbounds i8, ptr %3, i32 4
  store i32 %2, ptr %4, align 4
  %5 = getelementptr inbounds i8, ptr %_0, i32 8
  store ptr %args, ptr %5, align 4
  %6 = getelementptr inbounds i8, ptr %5, i32 4
  store i32 1, ptr %6, align 4
  ret void
}

; core::num::<impl usize>::unchecked_mul::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @"_ZN4core3num23_$LT$impl$u20$usize$GT$13unchecked_mul18precondition_check17h80d5c36690babae8E"(i32 %lhs, i32 %rhs) unnamed_addr #0 {
start:
  %0 = call { i32, i1 } @llvm.umul.with.overflow.i32(i32 %lhs, i32 %rhs)
  %_6.0 = extractvalue { i32, i1 } %0, 0
  %_6.1 = extractvalue { i32, i1 } %0, 1
  br i1 %_6.1, label %bb1, label %bb2

bb2:                                              ; preds = %start
  ret void

bb1:                                              ; preds = %start
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17haa2a70e6d322fa1bE(ptr align 1 @alloc_ffc44ed1670ebf78d81555edceff65f6, i32 69) #10
  unreachable
}

; core::ops::function::FnOnce::call_once
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core3ops8function6FnOnce9call_once17h439016e4a162bc7dE(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %0, i32 %1) unnamed_addr #0 {
start:
  %_2 = alloca [8 x i8], align 4
  store ptr %0, ptr %_2, align 4
  %2 = getelementptr inbounds i8, ptr %_2, i32 4
  store i32 %1, ptr %2, align 4
  %3 = load ptr, ptr %_2, align 4
  %4 = getelementptr inbounds i8, ptr %_2, i32 4
  %5 = load i32, ptr %4, align 4
; call alloc::str::<impl alloc::borrow::ToOwned for str>::to_owned
  call void @"_ZN5alloc3str56_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$str$GT$8to_owned17h0f9038b7202c6933E"(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %3, i32 %5) #11
  ret void
}

; core::ptr::read_volatile::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core3ptr13read_volatile18precondition_check17h399c23b5ab78e4cdE(ptr %addr, i32 %align) unnamed_addr #0 {
start:
  %0 = alloca [4 x i8], align 4
  %_8 = alloca [24 x i8], align 4
  %_6 = ptrtoint ptr %addr to i32
  %1 = icmp eq i32 %_6, 0
  br i1 %1, label %bb3, label %bb4

bb3:                                              ; preds = %start
  br label %bb2

bb4:                                              ; preds = %start
  %2 = call i32 @llvm.ctpop.i32(i32 %align)
  store i32 %2, ptr %0, align 4
  %_9 = load i32, ptr %0, align 4
  %3 = icmp eq i32 %_9, 1
  br i1 %3, label %bb5, label %bb6

bb2:                                              ; preds = %bb5, %bb3
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17haa2a70e6d322fa1bE(ptr align 1 @alloc_d4d2a2a8539eafc62756407d946babb3, i32 110) #10
  unreachable

bb5:                                              ; preds = %bb4
  %_13 = sub i32 %align, 1
  %_12 = and i32 %_6, %_13
  %_3 = icmp eq i32 %_12, 0
  br i1 %_3, label %bb1, label %bb2

bb6:                                              ; preds = %bb4
  store ptr @alloc_b498cf0a06cafe1ad822ab5dde97c8c0, ptr %_8, align 4
  %4 = getelementptr inbounds i8, ptr %_8, i32 4
  store i32 1, ptr %4, align 4
  %5 = load ptr, ptr @0, align 4
  %6 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  %7 = getelementptr inbounds i8, ptr %_8, i32 16
  store ptr %5, ptr %7, align 4
  %8 = getelementptr inbounds i8, ptr %7, i32 4
  store i32 %6, ptr %8, align 4
  %9 = getelementptr inbounds i8, ptr %_8, i32 8
  store ptr inttoptr (i32 4 to ptr), ptr %9, align 4
  %10 = getelementptr inbounds i8, ptr %9, i32 4
  store i32 0, ptr %10, align 4
; call core::panicking::panic_fmt
  call void @_ZN4core9panicking9panic_fmt17hb859252f4b513814E(ptr align 4 %_8, ptr align 4 @alloc_0cb02a4ed03d03a38de6e4c5fa52bcef) #10
  unreachable

bb1:                                              ; preds = %bb5
  ret void
}

; core::ptr::drop_in_place<alloc::string::String>
; Function Attrs: nounwind
define dso_local void @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h7dbac8ee672c113fE"(ptr align 4 %_1) unnamed_addr #1 {
start:
; call core::ptr::drop_in_place<alloc::vec::Vec<u8>>
  call void @"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17hec5b735cbb9fb57eE"(ptr align 4 %_1) #11
  ret void
}

; core::ptr::drop_in_place<alloc::vec::Vec<u8>>
; Function Attrs: nounwind
define dso_local void @"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17hec5b735cbb9fb57eE"(ptr align 4 %_1) unnamed_addr #1 {
start:
; call <alloc::vec::Vec<T,A> as core::ops::drop::Drop>::drop
  call void @"_ZN70_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h02275afedbaa4e31E"(ptr align 4 %_1) #11
; call core::ptr::drop_in_place<alloc::raw_vec::RawVec<u8>>
  call void @"_ZN4core3ptr53drop_in_place$LT$alloc..raw_vec..RawVec$LT$u8$GT$$GT$17hbe2951f76e8ddf1cE"(ptr align 4 %_1) #11
  ret void
}

; core::ptr::drop_in_place<alloc::raw_vec::RawVec<u8>>
; Function Attrs: nounwind
define dso_local void @"_ZN4core3ptr53drop_in_place$LT$alloc..raw_vec..RawVec$LT$u8$GT$$GT$17hbe2951f76e8ddf1cE"(ptr align 4 %_1) unnamed_addr #1 {
start:
; call <alloc::raw_vec::RawVec<T,A> as core::ops::drop::Drop>::drop
  call void @"_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hce356f15bedc9662E"(ptr align 4 %_1) #11
  ret void
}

; core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17h4c75038e99953160E"(ptr %ptr) unnamed_addr #0 {
start:
  %_4 = ptrtoint ptr %ptr to i32
  %0 = icmp eq i32 %_4, 0
  br i1 %0, label %bb1, label %bb2

bb1:                                              ; preds = %start
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17haa2a70e6d322fa1bE(ptr align 1 @alloc_20b3d155afd5c58c42e598b7e6d186ef, i32 93) #10
  unreachable

bb2:                                              ; preds = %start
  ret void
}

; core::alloc::layout::Layout::array::inner
; Function Attrs: inlinehint nounwind
define internal { i32, i32 } @_ZN4core5alloc6layout6Layout5array5inner17h360b6ffbd44a5607E(i32 %element_size, i32 %align, i32 %n) unnamed_addr #0 {
start:
  %_20 = alloca [4 x i8], align 4
  %_13 = alloca [4 x i8], align 4
  %_0 = alloca [8 x i8], align 4
  %0 = icmp eq i32 %element_size, 0
  br i1 %0, label %bb5, label %bb1

bb5:                                              ; preds = %bb4, %start
  br label %bb7

bb1:                                              ; preds = %start
  store i32 %align, ptr %_13, align 4
  %_14 = load i32, ptr %_13, align 4
  %_15 = icmp uge i32 %_14, 1
  %_16 = icmp ule i32 %_14, -2147483648
  %_17 = and i1 %_15, %_16
  %_11 = sub i32 %_14, 1
  %_6 = sub i32 2147483647, %_11
  %_7 = icmp eq i32 %element_size, 0
  br i1 %_7, label %panic, label %bb2

bb2:                                              ; preds = %bb1
  %_5 = udiv i32 %_6, %element_size
  %_4 = icmp ugt i32 %n, %_5
  br i1 %_4, label %bb3, label %bb4

panic:                                            ; preds = %bb1
; call core::panicking::panic_const::panic_const_div_by_zero
  call void @_ZN4core9panicking11panic_const23panic_const_div_by_zero17he275f7f3c4ee93c1E(ptr align 4 @alloc_8433b83260b07f87ec151c668c14e66d) #10
  unreachable

bb4:                                              ; preds = %bb2
  br label %bb5

bb3:                                              ; preds = %bb2
  %1 = load i32, ptr @0, align 4
  %2 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store i32 %1, ptr %_0, align 4
  %3 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %2, ptr %3, align 4
  br label %bb6

bb7:                                              ; preds = %bb5
; call core::num::<impl usize>::unchecked_mul::precondition_check
  call void @"_ZN4core3num23_$LT$impl$u20$usize$GT$13unchecked_mul18precondition_check17h80d5c36690babae8E"(i32 %element_size, i32 %n) #11
  br label %bb8

bb8:                                              ; preds = %bb7
  %array_size = mul nuw i32 %element_size, %n
  store i32 %align, ptr %_20, align 4
  %_21 = load i32, ptr %_20, align 4
  %_22 = icmp uge i32 %_21, 1
  %_23 = icmp ule i32 %_21, -2147483648
  %_24 = and i1 %_22, %_23
  store i32 %_21, ptr %_0, align 4
  %4 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %array_size, ptr %4, align 4
  br label %bb6

bb6:                                              ; preds = %bb3, %bb8
  %5 = load i32, ptr %_0, align 4
  %6 = getelementptr inbounds i8, ptr %_0, i32 4
  %7 = load i32, ptr %6, align 4
  %8 = insertvalue { i32, i32 } poison, i32 %5, 0
  %9 = insertvalue { i32, i32 } %8, i32 %7, 1
  ret { i32, i32 } %9
}

; core::alloc::layout::Layout::dangling
; Function Attrs: inlinehint nounwind
define internal ptr @_ZN4core5alloc6layout6Layout8dangling17h797a10ab27360b0bE(ptr align 4 %self) unnamed_addr #0 {
start:
  %_5 = alloca [4 x i8], align 4
  %self1 = load i32, ptr %self, align 4
  store i32 %self1, ptr %_5, align 4
  %_6 = load i32, ptr %_5, align 4
  %_7 = icmp uge i32 %_6, 1
  %_8 = icmp ule i32 %_6, -2147483648
  %_9 = and i1 %_7, %_8
  %ptr = getelementptr i8, ptr null, i32 %_6
  br label %bb1

bb1:                                              ; preds = %start
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17h4c75038e99953160E"(ptr %ptr) #11
  br label %bb3

bb3:                                              ; preds = %bb1
  ret ptr %ptr
}

; core::option::Option<T>::map_or_else
; Function Attrs: inlinehint nounwind
define dso_local void @"_ZN4core6option15Option$LT$T$GT$11map_or_else17h7d2ffd2deb78c202E"(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %0, i32 %1, ptr align 4 %default) unnamed_addr #0 {
start:
  %self = alloca [8 x i8], align 4
  store ptr %0, ptr %self, align 4
  %2 = getelementptr inbounds i8, ptr %self, i32 4
  store i32 %1, ptr %2, align 4
  %3 = load ptr, ptr %self, align 4
  %4 = ptrtoint ptr %3 to i32
  %5 = icmp eq i32 %4, 0
  %_4 = select i1 %5, i32 0, i32 1
  %6 = icmp eq i32 %_4, 0
  br i1 %6, label %bb2, label %bb3

bb2:                                              ; preds = %start
; call alloc::fmt::format::{{closure}}
  call void @"_ZN5alloc3fmt6format28_$u7b$$u7b$closure$u7d$$u7d$17hcfbbc79750d05ceeE"(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %default) #11
  br label %bb6

bb3:                                              ; preds = %start
  %t.0 = load ptr, ptr %self, align 4
  %7 = getelementptr inbounds i8, ptr %self, i32 4
  %t.1 = load i32, ptr %7, align 4
; call core::ops::function::FnOnce::call_once
  call void @_ZN4core3ops8function6FnOnce9call_once17h439016e4a162bc7dE(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %t.0, i32 %t.1) #11
  br label %bb7

bb6:                                              ; preds = %bb7, %bb2
  ret void

bb7:                                              ; preds = %bb3
  br label %bb6

bb1:                                              ; No predecessors!
  unreachable
}

; core::ub_checks::is_nonoverlapping::runtime
; Function Attrs: inlinehint nounwind
define internal zeroext i1 @_ZN4core9ub_checks17is_nonoverlapping7runtime17hf12dc3737f413ed6E(ptr %src, ptr %dst, i32 %size, i32 %count) unnamed_addr #0 {
start:
  %0 = alloca [1 x i8], align 1
  %diff = alloca [4 x i8], align 4
  %_9 = alloca [8 x i8], align 4
  %src_usize = ptrtoint ptr %src to i32
  %dst_usize = ptrtoint ptr %dst to i32
  %1 = call { i32, i1 } @llvm.umul.with.overflow.i32(i32 %size, i32 %count)
  %_15.0 = extractvalue { i32, i1 } %1, 0
  %_15.1 = extractvalue { i32, i1 } %1, 1
  %2 = call i1 @llvm.expect.i1(i1 %_15.1, i1 false)
  %3 = zext i1 %2 to i8
  store i8 %3, ptr %0, align 1
  %4 = load i8, ptr %0, align 1
  %_12 = trunc i8 %4 to i1
  br i1 %_12, label %bb2, label %bb3

bb3:                                              ; preds = %start
  %5 = getelementptr inbounds i8, ptr %_9, i32 4
  store i32 %_15.0, ptr %5, align 4
  store i32 1, ptr %_9, align 4
  %6 = getelementptr inbounds i8, ptr %_9, i32 4
  %size1 = load i32, ptr %6, align 4
  %_22 = icmp ult i32 %src_usize, %dst_usize
  br i1 %_22, label %bb4, label %bb5

bb2:                                              ; preds = %start
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17haa2a70e6d322fa1bE(ptr align 1 @alloc_763310d78c99c2c1ad3f8a9821e942f3, i32 61) #10
  unreachable

bb5:                                              ; preds = %bb3
  %7 = sub i32 %src_usize, %dst_usize
  store i32 %7, ptr %diff, align 4
  br label %bb6

bb4:                                              ; preds = %bb3
  %8 = sub i32 %dst_usize, %src_usize
  store i32 %8, ptr %diff, align 4
  br label %bb6

bb6:                                              ; preds = %bb4, %bb5
  %_11 = load i32, ptr %diff, align 4
  %_0 = icmp uge i32 %_11, %size1
  ret i1 %_0
}

; <T as alloc::slice::hack::ConvertVec>::to_vec
; Function Attrs: inlinehint nounwind
define dso_local void @"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17hf75266b8071e276eE"(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %s.0, i32 %s.1) unnamed_addr #0 {
start:
  %_12 = alloca [12 x i8], align 4
  %v = alloca [12 x i8], align 4
; call alloc::raw_vec::RawVec<T,A>::try_allocate_in
  call void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h80179352172c059cE"(ptr sret([12 x i8]) align 4 %_12, i32 %s.1, i1 zeroext false) #11
  %_13 = load i32, ptr %_12, align 4
  %0 = icmp eq i32 %_13, 0
  br i1 %0, label %bb4, label %bb3

bb4:                                              ; preds = %start
  %1 = getelementptr inbounds i8, ptr %_12, i32 4
  %res.0 = load i32, ptr %1, align 4
  %2 = getelementptr inbounds i8, ptr %1, i32 4
  %res.1 = load ptr, ptr %2, align 4
  store i32 %res.0, ptr %v, align 4
  %3 = getelementptr inbounds i8, ptr %v, i32 4
  store ptr %res.1, ptr %3, align 4
  %4 = getelementptr inbounds i8, ptr %v, i32 8
  store i32 0, ptr %4, align 4
  %5 = getelementptr inbounds i8, ptr %v, i32 4
  %self = load ptr, ptr %5, align 4
  br label %bb5

bb3:                                              ; preds = %start
  %6 = getelementptr inbounds i8, ptr %_12, i32 4
  %err.0 = load i32, ptr %6, align 4
  %7 = getelementptr inbounds i8, ptr %6, i32 4
  %err.1 = load i32, ptr %7, align 4
; call alloc::raw_vec::handle_error
  call void @_ZN5alloc7raw_vec12handle_error17h604585f1a2687b06E(i32 %err.0, i32 %err.1) #10
  unreachable

bb5:                                              ; preds = %bb4
; call core::intrinsics::copy_nonoverlapping::precondition_check
  call void @_ZN4core10intrinsics19copy_nonoverlapping18precondition_check17hbccae9224de1e6dfE(ptr %s.0, ptr %self, i32 1, i32 1, i32 %s.1) #11
  br label %bb7

bb7:                                              ; preds = %bb5
  %8 = mul i32 %s.1, 1
  call void @llvm.memcpy.p0.p0.i32(ptr align 1 %self, ptr align 1 %s.0, i32 %8, i1 false)
  %9 = getelementptr inbounds i8, ptr %v, i32 8
  store i32 %s.1, ptr %9, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_0, ptr align 4 %v, i32 12, i1 false)
  ret void

bb2:                                              ; No predecessors!
  unreachable
}

; alloc::fmt::format
; Function Attrs: inlinehint nounwind
define internal void @_ZN5alloc3fmt6format17h635fe96375423fb4E(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %args) unnamed_addr #0 {
start:
  %_2 = alloca [8 x i8], align 4
  %_6.0 = load ptr, ptr %args, align 4
  %0 = getelementptr inbounds i8, ptr %args, i32 4
  %_6.1 = load i32, ptr %0, align 4
  %1 = getelementptr inbounds i8, ptr %args, i32 8
  %_7.0 = load ptr, ptr %1, align 4
  %2 = getelementptr inbounds i8, ptr %1, i32 4
  %_7.1 = load i32, ptr %2, align 4
  %3 = icmp eq i32 %_6.1, 0
  br i1 %3, label %bb4, label %bb5

bb4:                                              ; preds = %start
  %4 = icmp eq i32 %_7.1, 0
  br i1 %4, label %bb7, label %bb3

bb5:                                              ; preds = %start
  %5 = icmp eq i32 %_6.1, 1
  br i1 %5, label %bb6, label %bb3

bb7:                                              ; preds = %bb4
  store ptr inttoptr (i32 1 to ptr), ptr %_2, align 4
  %6 = getelementptr inbounds i8, ptr %_2, i32 4
  store i32 0, ptr %6, align 4
  br label %bb2

bb3:                                              ; preds = %bb6, %bb5, %bb4
  %7 = load ptr, ptr @0, align 4
  %8 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store ptr %7, ptr %_2, align 4
  %9 = getelementptr inbounds i8, ptr %_2, i32 4
  store i32 %8, ptr %9, align 4
  br label %bb2

bb2:                                              ; preds = %bb3, %bb8, %bb7
  %10 = load ptr, ptr %_2, align 4
  %11 = getelementptr inbounds i8, ptr %_2, i32 4
  %12 = load i32, ptr %11, align 4
; call core::option::Option<T>::map_or_else
  call void @"_ZN4core6option15Option$LT$T$GT$11map_or_else17h7d2ffd2deb78c202E"(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %10, i32 %12, ptr align 4 %args) #11
  ret void

bb6:                                              ; preds = %bb5
  %13 = icmp eq i32 %_7.1, 0
  br i1 %13, label %bb8, label %bb3

bb8:                                              ; preds = %bb6
  %s = getelementptr inbounds [0 x { ptr, i32 }], ptr %_6.0, i32 0, i32 0
  %14 = getelementptr inbounds [0 x { ptr, i32 }], ptr %_6.0, i32 0, i32 0
  %_13.0 = load ptr, ptr %14, align 4
  %15 = getelementptr inbounds i8, ptr %14, i32 4
  %_13.1 = load i32, ptr %15, align 4
  store ptr %_13.0, ptr %_2, align 4
  %16 = getelementptr inbounds i8, ptr %_2, i32 4
  store i32 %_13.1, ptr %16, align 4
  br label %bb2
}

; alloc::fmt::format::{{closure}}
; Function Attrs: inlinehint nounwind
define dso_local void @"_ZN5alloc3fmt6format28_$u7b$$u7b$closure$u7d$$u7d$17hcfbbc79750d05ceeE"(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %_1) unnamed_addr #0 {
start:
  %_2 = alloca [24 x i8], align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_2, ptr align 4 %_1, i32 24, i1 false)
; call alloc::fmt::format::format_inner
  call void @_ZN5alloc3fmt6format12format_inner17h0de79ee30ca13045E(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %_2) #11
  ret void
}

; alloc::str::<impl alloc::borrow::ToOwned for str>::to_owned
; Function Attrs: inlinehint nounwind
define internal void @"_ZN5alloc3str56_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$str$GT$8to_owned17h0f9038b7202c6933E"(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %self.0, i32 %self.1) unnamed_addr #0 {
start:
  %bytes = alloca [12 x i8], align 4
; call <T as alloc::slice::hack::ConvertVec>::to_vec
  call void @"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17hf75266b8071e276eE"(ptr sret([12 x i8]) align 4 %bytes, ptr align 1 %self.0, i32 %self.1) #11
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_0, ptr align 4 %bytes, i32 12, i1 false)
  ret void
}

; alloc::alloc::alloc
; Function Attrs: inlinehint nounwind
define internal ptr @_ZN5alloc5alloc5alloc17hc0e0a0ee73dcde5aE(i32 %0, i32 %1) unnamed_addr #0 {
start:
  %2 = alloca [1 x i8], align 1
  %_11 = alloca [4 x i8], align 4
  %layout = alloca [8 x i8], align 4
  store i32 %0, ptr %layout, align 4
  %3 = getelementptr inbounds i8, ptr %layout, i32 4
  store i32 %1, ptr %3, align 4
  br label %bb3

bb3:                                              ; preds = %start
; call core::ptr::read_volatile::precondition_check
  call void @_ZN4core3ptr13read_volatile18precondition_check17h399c23b5ab78e4cdE(ptr @__rust_no_alloc_shim_is_unstable, i32 1) #11
  br label %bb5

bb5:                                              ; preds = %bb3
  %4 = load volatile i8, ptr @__rust_no_alloc_shim_is_unstable, align 1
  store i8 %4, ptr %2, align 1
  %_2 = load i8, ptr %2, align 1
  %5 = getelementptr inbounds i8, ptr %layout, i32 4
  %_3 = load i32, ptr %5, align 4
  %self = load i32, ptr %layout, align 4
  store i32 %self, ptr %_11, align 4
  %_12 = load i32, ptr %_11, align 4
  %_13 = icmp uge i32 %_12, 1
  %_14 = icmp ule i32 %_12, -2147483648
  %_15 = and i1 %_13, %_14
  %_0 = call ptr @__rust_alloc(i32 %_3, i32 %_12) #11
  ret ptr %_0
}

; alloc::alloc::Global::alloc_impl
; Function Attrs: inlinehint nounwind
define internal { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17hdf4223369f5bb6c0E(ptr align 1 %self, i32 %0, i32 %1, i1 zeroext %zeroed) unnamed_addr #0 {
start:
  %_29 = alloca [4 x i8], align 4
  %self3 = alloca [4 x i8], align 4
  %self2 = alloca [4 x i8], align 4
  %_11 = alloca [4 x i8], align 4
  %layout1 = alloca [8 x i8], align 4
  %raw_ptr = alloca [4 x i8], align 4
  %_0 = alloca [8 x i8], align 4
  %layout = alloca [8 x i8], align 4
  store i32 %0, ptr %layout, align 4
  %2 = getelementptr inbounds i8, ptr %layout, i32 4
  store i32 %1, ptr %2, align 4
  %3 = getelementptr inbounds i8, ptr %layout, i32 4
  %size = load i32, ptr %3, align 4
  %4 = icmp eq i32 %size, 0
  br i1 %4, label %bb2, label %bb1

bb2:                                              ; preds = %start
; call core::alloc::layout::Layout::dangling
  %data = call ptr @_ZN4core5alloc6layout6Layout8dangling17h797a10ab27360b0bE(ptr align 4 %layout) #11
  br label %bb8

bb1:                                              ; preds = %start
  br i1 %zeroed, label %bb4, label %bb5

bb8:                                              ; preds = %bb2
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17h4c75038e99953160E"(ptr %data) #11
  br label %bb10

bb10:                                             ; preds = %bb8
  store ptr %data, ptr %_0, align 4
  %5 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 0, ptr %5, align 4
  br label %bb7

bb7:                                              ; preds = %bb18, %bb12, %bb10
  %6 = load ptr, ptr %_0, align 4
  %7 = getelementptr inbounds i8, ptr %_0, i32 4
  %8 = load i32, ptr %7, align 4
  %9 = insertvalue { ptr, i32 } poison, ptr %6, 0
  %10 = insertvalue { ptr, i32 } %9, i32 %8, 1
  ret { ptr, i32 } %10

bb5:                                              ; preds = %bb1
  %11 = load i32, ptr %layout, align 4
  %12 = getelementptr inbounds i8, ptr %layout, i32 4
  %13 = load i32, ptr %12, align 4
; call alloc::alloc::alloc
  %14 = call ptr @_ZN5alloc5alloc5alloc17hc0e0a0ee73dcde5aE(i32 %11, i32 %13) #11
  store ptr %14, ptr %raw_ptr, align 4
  br label %bb6

bb4:                                              ; preds = %bb1
  %15 = load i32, ptr %layout, align 4
  %16 = getelementptr inbounds i8, ptr %layout, i32 4
  %17 = load i32, ptr %16, align 4
  store i32 %15, ptr %layout1, align 4
  %18 = getelementptr inbounds i8, ptr %layout1, i32 4
  store i32 %17, ptr %18, align 4
  %self4 = load i32, ptr %layout, align 4
  store i32 %self4, ptr %_29, align 4
  %_30 = load i32, ptr %_29, align 4
  %_31 = icmp uge i32 %_30, 1
  %_32 = icmp ule i32 %_30, -2147483648
  %_33 = and i1 %_31, %_32
  %19 = call ptr @__rust_alloc_zeroed(i32 %size, i32 %_30) #11
  store ptr %19, ptr %raw_ptr, align 4
  br label %bb6

bb6:                                              ; preds = %bb4, %bb5
  %ptr = load ptr, ptr %raw_ptr, align 4
  %_35 = ptrtoint ptr %ptr to i32
  %20 = icmp eq i32 %_35, 0
  br i1 %20, label %bb12, label %bb13

bb12:                                             ; preds = %bb6
  store ptr null, ptr %self3, align 4
  store ptr null, ptr %self2, align 4
  %21 = load ptr, ptr @0, align 4
  %22 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store ptr %21, ptr %_0, align 4
  %23 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %22, ptr %23, align 4
  br label %bb7

bb13:                                             ; preds = %bb6
  br label %bb14

bb14:                                             ; preds = %bb13
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17h4c75038e99953160E"(ptr %ptr) #11
  br label %bb15

bb15:                                             ; preds = %bb14
  store ptr %ptr, ptr %self3, align 4
  %v = load ptr, ptr %self3, align 4
  store ptr %v, ptr %self2, align 4
  %v5 = load ptr, ptr %self2, align 4
  store ptr %v5, ptr %_11, align 4
  %ptr6 = load ptr, ptr %_11, align 4
  br label %bb16

bb16:                                             ; preds = %bb15
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17h4c75038e99953160E"(ptr %ptr6) #11
  br label %bb18

bb18:                                             ; preds = %bb16
  store ptr %ptr6, ptr %_0, align 4
  %24 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %size, ptr %24, align 4
  br label %bb7
}

; alloc::raw_vec::RawVec<T,A>::current_memory
; Function Attrs: nounwind
define dso_local void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h2d4b2ab701937f9dE"(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %self) unnamed_addr #1 {
start:
  %_9 = alloca [12 x i8], align 4
  br label %bb1

bb1:                                              ; preds = %start
  %_3 = load i32, ptr %self, align 4
  %0 = icmp eq i32 %_3, 0
  br i1 %0, label %bb2, label %bb4

bb2:                                              ; preds = %bb1
  br label %bb3

bb4:                                              ; preds = %bb1
  %rhs = load i32, ptr %self, align 4
  br label %bb6

bb3:                                              ; preds = %bb2
  %1 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 0, ptr %1, align 4
  br label %bb5

bb6:                                              ; preds = %bb4
; call core::num::<impl usize>::unchecked_mul::precondition_check
  call void @"_ZN4core3num23_$LT$impl$u20$usize$GT$13unchecked_mul18precondition_check17h80d5c36690babae8E"(i32 1, i32 %rhs) #11
  br label %bb7

bb7:                                              ; preds = %bb6
  %size = mul nuw i32 1, %rhs
  %2 = getelementptr inbounds i8, ptr %self, i32 4
  %self1 = load ptr, ptr %2, align 4
  store ptr %self1, ptr %_9, align 4
  %3 = getelementptr inbounds i8, ptr %_9, i32 4
  store i32 1, ptr %3, align 4
  %4 = getelementptr inbounds i8, ptr %3, i32 4
  store i32 %size, ptr %4, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_0, ptr align 4 %_9, i32 12, i1 false)
  br label %bb5

bb5:                                              ; preds = %bb3, %bb7
  ret void
}

; alloc::raw_vec::RawVec<T,A>::try_allocate_in
; Function Attrs: nounwind
define dso_local void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h80179352172c059cE"(ptr sret([12 x i8]) align 4 %_0, i32 %capacity, i1 zeroext %0) unnamed_addr #1 {
start:
  %self = alloca [8 x i8], align 4
  %result = alloca [8 x i8], align 4
  %_11 = alloca [8 x i8], align 4
  %_8 = alloca [8 x i8], align 4
  %layout = alloca [8 x i8], align 4
  %alloc = alloca [0 x i8], align 1
  %init = alloca [1 x i8], align 1
  %1 = zext i1 %0 to i8
  store i8 %1, ptr %init, align 1
  br label %bb1

bb1:                                              ; preds = %start
  %2 = icmp eq i32 %capacity, 0
  br i1 %2, label %bb2, label %bb4

bb2:                                              ; preds = %bb1
; call alloc::raw_vec::RawVec<T,A>::new_in
  %3 = call { i32, ptr } @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6new_in17h9e368f34efbb37b7E"() #11
  %_5.0 = extractvalue { i32, ptr } %3, 0
  %_5.1 = extractvalue { i32, ptr } %3, 1
  %4 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %_5.0, ptr %4, align 4
  %5 = getelementptr inbounds i8, ptr %4, i32 4
  store ptr %_5.1, ptr %5, align 4
  store i32 0, ptr %_0, align 4
  br label %bb15

bb4:                                              ; preds = %bb1
; call core::alloc::layout::Layout::array::inner
  %6 = call { i32, i32 } @_ZN4core5alloc6layout6Layout5array5inner17h360b6ffbd44a5607E(i32 1, i32 1, i32 %capacity) #11
  %7 = extractvalue { i32, i32 } %6, 0
  %8 = extractvalue { i32, i32 } %6, 1
  store i32 %7, ptr %_8, align 4
  %9 = getelementptr inbounds i8, ptr %_8, i32 4
  store i32 %8, ptr %9, align 4
  %10 = load i32, ptr %_8, align 4
  %11 = icmp eq i32 %10, 0
  %_9 = select i1 %11, i32 1, i32 0
  %12 = icmp eq i32 %_9, 0
  br i1 %12, label %bb7, label %bb6

bb7:                                              ; preds = %bb4
  %layout.0 = load i32, ptr %_8, align 4
  %13 = getelementptr inbounds i8, ptr %_8, i32 4
  %layout.1 = load i32, ptr %13, align 4
  store i32 %layout.0, ptr %layout, align 4
  %14 = getelementptr inbounds i8, ptr %layout, i32 4
  store i32 %layout.1, ptr %14, align 4
  %_31 = icmp ugt i32 %layout.1, 2147483647
  br i1 %_31, label %bb19, label %bb20

bb6:                                              ; preds = %bb4
  %15 = load i32, ptr @0, align 4
  %16 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  %17 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %15, ptr %17, align 4
  %18 = getelementptr inbounds i8, ptr %17, i32 4
  store i32 %16, ptr %18, align 4
  store i32 1, ptr %_0, align 4
  br label %bb16

bb20:                                             ; preds = %bb7
  %19 = load i8, ptr %init, align 1
  %20 = trunc i8 %19 to i1
  %_16 = zext i1 %20 to i32
  %21 = icmp eq i32 %_16, 0
  br i1 %21, label %bb9, label %bb8

bb19:                                             ; preds = %bb7
  %22 = load i32, ptr @0, align 4
  %23 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store i32 %22, ptr %_11, align 4
  %24 = getelementptr inbounds i8, ptr %_11, i32 4
  store i32 %23, ptr %24, align 4
  %err.0 = load i32, ptr %_11, align 4
  %25 = getelementptr inbounds i8, ptr %_11, i32 4
  %err.1 = load i32, ptr %25, align 4
  %26 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %err.0, ptr %26, align 4
  %27 = getelementptr inbounds i8, ptr %26, i32 4
  store i32 %err.1, ptr %27, align 4
  store i32 1, ptr %_0, align 4
  br label %bb16

bb9:                                              ; preds = %bb20
; call <alloc::alloc::Global as core::alloc::Allocator>::allocate
  %28 = call { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$8allocate17hb6eff5391135ac2cE"(ptr align 1 %alloc, i32 %layout.0, i32 %layout.1) #11
  %29 = extractvalue { ptr, i32 } %28, 0
  %30 = extractvalue { ptr, i32 } %28, 1
  store ptr %29, ptr %result, align 4
  %31 = getelementptr inbounds i8, ptr %result, i32 4
  store i32 %30, ptr %31, align 4
  br label %bb12

bb8:                                              ; preds = %bb20
; call <alloc::alloc::Global as core::alloc::Allocator>::allocate_zeroed
  %32 = call { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$15allocate_zeroed17h27b8ea0f706305e9E"(ptr align 1 %alloc, i32 %layout.0, i32 %layout.1) #11
  %33 = extractvalue { ptr, i32 } %32, 0
  %34 = extractvalue { ptr, i32 } %32, 1
  store ptr %33, ptr %result, align 4
  %35 = getelementptr inbounds i8, ptr %result, i32 4
  store i32 %34, ptr %35, align 4
  br label %bb12

bb12:                                             ; preds = %bb8, %bb9
  %36 = load ptr, ptr %result, align 4
  %37 = ptrtoint ptr %36 to i32
  %38 = icmp eq i32 %37, 0
  %_19 = select i1 %38, i32 1, i32 0
  %39 = icmp eq i32 %_19, 0
  br i1 %39, label %bb14, label %bb13

bb14:                                             ; preds = %bb12
  %ptr.0 = load ptr, ptr %result, align 4
  %40 = getelementptr inbounds i8, ptr %result, i32 4
  %ptr.1 = load i32, ptr %40, align 4
  %41 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %capacity, ptr %41, align 4
  %42 = getelementptr inbounds i8, ptr %41, i32 4
  store ptr %ptr.0, ptr %42, align 4
  store i32 0, ptr %_0, align 4
  br label %bb15

bb13:                                             ; preds = %bb12
  store i32 %layout.0, ptr %self, align 4
  %43 = getelementptr inbounds i8, ptr %self, i32 4
  store i32 %layout.1, ptr %43, align 4
  %_21.0 = load i32, ptr %self, align 4
  %44 = getelementptr inbounds i8, ptr %self, i32 4
  %_21.1 = load i32, ptr %44, align 4
  %45 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %_21.0, ptr %45, align 4
  %46 = getelementptr inbounds i8, ptr %45, i32 4
  store i32 %_21.1, ptr %46, align 4
  store i32 1, ptr %_0, align 4
  br label %bb16

bb15:                                             ; preds = %bb2, %bb14
  br label %bb17

bb16:                                             ; preds = %bb6, %bb19, %bb13
  br label %bb17

bb17:                                             ; preds = %bb15, %bb16
  ret void

bb5:                                              ; No predecessors!
  unreachable
}

; alloc::raw_vec::RawVec<T,A>::new_in
; Function Attrs: nounwind
define dso_local { i32, ptr } @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6new_in17h9e368f34efbb37b7E"() unnamed_addr #1 {
start:
  br label %bb1

bb1:                                              ; preds = %start
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17h4c75038e99953160E"(ptr getelementptr (i8, ptr null, i32 1)) #11
  br label %bb3

bb3:                                              ; preds = %bb1
  ret { i32, ptr } { i32 0, ptr getelementptr (i8, ptr null, i32 1) }
}

; <alloc::alloc::Global as core::alloc::Allocator>::deallocate
; Function Attrs: inlinehint nounwind
define internal void @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h4ea3f0e4dc7eb09fE"(ptr align 1 %self, ptr %ptr, i32 %0, i32 %1) unnamed_addr #0 {
start:
  %_13 = alloca [4 x i8], align 4
  %layout1 = alloca [8 x i8], align 4
  %layout = alloca [8 x i8], align 4
  store i32 %0, ptr %layout, align 4
  %2 = getelementptr inbounds i8, ptr %layout, i32 4
  store i32 %1, ptr %2, align 4
  %3 = getelementptr inbounds i8, ptr %layout, i32 4
  %_4 = load i32, ptr %3, align 4
  %4 = icmp eq i32 %_4, 0
  br i1 %4, label %bb2, label %bb1

bb2:                                              ; preds = %bb1, %start
  ret void

bb1:                                              ; preds = %start
  %5 = load i32, ptr %layout, align 4
  %6 = getelementptr inbounds i8, ptr %layout, i32 4
  %7 = load i32, ptr %6, align 4
  store i32 %5, ptr %layout1, align 4
  %8 = getelementptr inbounds i8, ptr %layout1, i32 4
  store i32 %7, ptr %8, align 4
  %self2 = load i32, ptr %layout, align 4
  store i32 %self2, ptr %_13, align 4
  %_14 = load i32, ptr %_13, align 4
  %_15 = icmp uge i32 %_14, 1
  %_16 = icmp ule i32 %_14, -2147483648
  %_17 = and i1 %_15, %_16
  call void @__rust_dealloc(ptr %ptr, i32 %_4, i32 %_14) #11
  br label %bb2
}

; <alloc::alloc::Global as core::alloc::Allocator>::allocate_zeroed
; Function Attrs: inlinehint nounwind
define internal { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$15allocate_zeroed17h27b8ea0f706305e9E"(ptr align 1 %self, i32 %layout.0, i32 %layout.1) unnamed_addr #0 {
start:
; call alloc::alloc::Global::alloc_impl
  %0 = call { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17hdf4223369f5bb6c0E(ptr align 1 %self, i32 %layout.0, i32 %layout.1, i1 zeroext true) #11
  %_0.0 = extractvalue { ptr, i32 } %0, 0
  %_0.1 = extractvalue { ptr, i32 } %0, 1
  %1 = insertvalue { ptr, i32 } poison, ptr %_0.0, 0
  %2 = insertvalue { ptr, i32 } %1, i32 %_0.1, 1
  ret { ptr, i32 } %2
}

; <alloc::alloc::Global as core::alloc::Allocator>::allocate
; Function Attrs: inlinehint nounwind
define internal { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$8allocate17hb6eff5391135ac2cE"(ptr align 1 %self, i32 %layout.0, i32 %layout.1) unnamed_addr #0 {
start:
; call alloc::alloc::Global::alloc_impl
  %0 = call { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17hdf4223369f5bb6c0E(ptr align 1 %self, i32 %layout.0, i32 %layout.1, i1 zeroext false) #11
  %_0.0 = extractvalue { ptr, i32 } %0, 0
  %_0.1 = extractvalue { ptr, i32 } %0, 1
  %1 = insertvalue { ptr, i32 } poison, ptr %_0.0, 0
  %2 = insertvalue { ptr, i32 } %1, i32 %_0.1, 1
  ret { ptr, i32 } %2
}

; <alloc::vec::Vec<T,A> as core::ops::drop::Drop>::drop
; Function Attrs: nounwind
define dso_local void @"_ZN70_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h02275afedbaa4e31E"(ptr align 4 %self) unnamed_addr #1 {
start:
  %0 = getelementptr inbounds i8, ptr %self, i32 4
  %self1 = load ptr, ptr %0, align 4
  %1 = getelementptr inbounds i8, ptr %self, i32 8
  %len = load i32, ptr %1, align 4
  ret void
}

; <alloc::raw_vec::RawVec<T,A> as core::ops::drop::Drop>::drop
; Function Attrs: nounwind
define dso_local void @"_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hce356f15bedc9662E"(ptr align 4 %self) unnamed_addr #1 {
start:
  %_2 = alloca [12 x i8], align 4
; call alloc::raw_vec::RawVec<T,A>::current_memory
  call void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h2d4b2ab701937f9dE"(ptr sret([12 x i8]) align 4 %_2, ptr align 4 %self) #11
  %0 = getelementptr inbounds i8, ptr %_2, i32 4
  %1 = load i32, ptr %0, align 4
  %2 = icmp eq i32 %1, 0
  %_4 = select i1 %2, i32 0, i32 1
  %3 = icmp eq i32 %_4, 1
  br i1 %3, label %bb2, label %bb4

bb2:                                              ; preds = %start
  %ptr = load ptr, ptr %_2, align 4
  %4 = getelementptr inbounds i8, ptr %_2, i32 4
  %layout.0 = load i32, ptr %4, align 4
  %5 = getelementptr inbounds i8, ptr %4, i32 4
  %layout.1 = load i32, ptr %5, align 4
  %_7 = getelementptr inbounds i8, ptr %self, i32 8
; call <alloc::alloc::Global as core::alloc::Allocator>::deallocate
  call void @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h4ea3f0e4dc7eb09fE"(ptr align 1 %_7, ptr %ptr, i32 %layout.0, i32 %layout.1) #11
  br label %bb4

bb4:                                              ; preds = %bb2, %start
  ret void

bb5:                                              ; No predecessors!
  unreachable
}

; probe1::probe
; Function Attrs: nounwind
define dso_local void @_ZN6probe15probe17hc165a276aeec47dfE() unnamed_addr #1 {
start:
  %_3.i = alloca [8 x i8], align 4
  %_6 = alloca [8 x i8], align 4
  %_5 = alloca [8 x i8], align 4
  %_3 = alloca [24 x i8], align 4
  %res = alloca [12 x i8], align 4
  %_1 = alloca [12 x i8], align 4
  store ptr @alloc_83ea17bf0c4f4a5a5a13d3ae7955acd0, ptr %_3.i, align 4
  %0 = getelementptr inbounds i8, ptr %_3.i, i32 4
  store ptr @"_ZN4core3fmt3num3imp55_$LT$impl$u20$core..fmt..LowerExp$u20$for$u20$isize$GT$3fmt17h102bd83187251afaE", ptr %0, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_6, ptr align 4 %_3.i, i32 8, i1 false)
  %1 = getelementptr inbounds [1 x %"core::fmt::rt::Argument<'_>"], ptr %_5, i32 0, i32 0
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %1, ptr align 4 %_6, i32 8, i1 false)
; call core::fmt::Arguments::new_v1
  call void @_ZN4core3fmt9Arguments6new_v117h2469593e1d413ab0E(ptr sret([24 x i8]) align 4 %_3, ptr align 4 @alloc_68ac15728a1e6ba4743b718936db7fdf, ptr align 4 %_5) #11
; call alloc::fmt::format
  call void @_ZN5alloc3fmt6format17h635fe96375423fb4E(ptr sret([12 x i8]) align 4 %res, ptr align 4 %_3) #11
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_1, ptr align 4 %res, i32 12, i1 false)
; call core::ptr::drop_in_place<alloc::string::String>
  call void @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h7dbac8ee672c113fE"(ptr align 4 %_1) #11
  ret void
}

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i32 @llvm.ctpop.i32(i32) #2

; core::panicking::panic_nounwind
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking14panic_nounwind17haa2a70e6d322fa1bE(ptr align 1, i32) unnamed_addr #3

; core::panicking::panic_fmt
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking9panic_fmt17hb859252f4b513814E(ptr align 4, ptr align 4) unnamed_addr #3

; core::fmt::num::imp::<impl core::fmt::LowerExp for isize>::fmt
; Function Attrs: nounwind
declare dso_local zeroext i1 @"_ZN4core3fmt3num3imp55_$LT$impl$u20$core..fmt..LowerExp$u20$for$u20$isize$GT$3fmt17h102bd83187251afaE"(ptr align 4, ptr align 4) unnamed_addr #1

; Function Attrs: nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i32(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i32, i1 immarg) #4

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare { i32, i1 } @llvm.umul.with.overflow.i32(i32, i32) #2

; core::panicking::panic_const::panic_const_div_by_zero
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking11panic_const23panic_const_div_by_zero17he275f7f3c4ee93c1E(ptr align 4) unnamed_addr #3

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(none)
declare i1 @llvm.expect.i1(i1, i1) #5

; alloc::raw_vec::handle_error
; Function Attrs: cold noreturn nounwind
declare dso_local void @_ZN5alloc7raw_vec12handle_error17h604585f1a2687b06E(i32, i32) unnamed_addr #6

; alloc::fmt::format::format_inner
; Function Attrs: nounwind
declare dso_local void @_ZN5alloc3fmt6format12format_inner17h0de79ee30ca13045E(ptr sret([12 x i8]) align 4, ptr align 4) unnamed_addr #1

; Function Attrs: nounwind allockind("alloc,uninitialized,aligned") allocsize(0)
declare dso_local noalias ptr @__rust_alloc(i32, i32 allocalign) unnamed_addr #7

; Function Attrs: nounwind allockind("alloc,zeroed,aligned") allocsize(0)
declare dso_local noalias ptr @__rust_alloc_zeroed(i32, i32 allocalign) unnamed_addr #8

; Function Attrs: nounwind allockind("free")
declare dso_local void @__rust_dealloc(ptr allocptr, i32, i32) unnamed_addr #9

attributes #0 = { inlinehint nounwind "target-cpu"="generic" }
attributes #1 = { nounwind "target-cpu"="generic" }
attributes #2 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #3 = { cold noinline noreturn nounwind "target-cpu"="generic" }
attributes #4 = { nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #5 = { nocallback nofree nosync nounwind willreturn memory(none) }
attributes #6 = { cold noreturn nounwind "target-cpu"="generic" }
attributes #7 = { nounwind allockind("alloc,uninitialized,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #8 = { nounwind allockind("alloc,zeroed,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #9 = { nounwind allockind("free") "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #10 = { noreturn nounwind }
attributes #11 = { nounwind }

!llvm.ident = !{!0}

!0 = !{!"rustc version 1.80.1 (3f5fd8dd4 2024-08-06)"}
