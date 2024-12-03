; ModuleID = 'probe1.3f338bd05b9585ae-cgu.0'
source_filename = "probe1.3f338bd05b9585ae-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

%"core::fmt::rt::Argument<'_>" = type { %"core::fmt::rt::ArgumentType<'_>" }
%"core::fmt::rt::ArgumentType<'_>" = type { [1 x i32], ptr }

@alloc_8df0580a595a87d56789d20c7318e185 = private unnamed_addr constant <{ [166 x i8] }> <{ [166 x i8] c"unsafe precondition(s) violated: ptr::copy_nonoverlapping requires that both pointer arguments are aligned and non-null and the specified memory ranges do not overlap" }>, align 1
@alloc_fad0cd83b7d1858a846a172eb260e593 = private unnamed_addr constant <{ [42 x i8] }> <{ [42 x i8] c"is_aligned_to: align is not a power-of-two" }>, align 1
@alloc_b498cf0a06cafe1ad822ab5dde97c8c0 = private unnamed_addr constant <{ ptr, [4 x i8] }> <{ ptr @alloc_fad0cd83b7d1858a846a172eb260e593, [4 x i8] c"*\00\00\00" }>, align 4
@0 = private unnamed_addr constant <{ [4 x i8], [4 x i8] }> <{ [4 x i8] zeroinitializer, [4 x i8] undef }>, align 4
@alloc_69f15bff8059880065ca4860a48f578a = private unnamed_addr constant <{ [81 x i8] }> <{ [81 x i8] c"/rustc/f6e511eec7342f59a25f7c0534f1dbea00d01b14/library/core/src/ptr/const_ptr.rs" }>, align 1
@alloc_825d86c8ab4aea810dd12a604502a33e = private unnamed_addr constant <{ ptr, [12 x i8] }> <{ ptr @alloc_69f15bff8059880065ca4860a48f578a, [12 x i8] c"Q\00\00\00\EB\05\00\00\0D\00\00\00" }>, align 4
@alloc_ffc44ed1670ebf78d81555edceff65f6 = private unnamed_addr constant <{ [69 x i8] }> <{ [69 x i8] c"unsafe precondition(s) violated: usize::unchecked_mul cannot overflow" }>, align 1
@alloc_d4d2a2a8539eafc62756407d946babb3 = private unnamed_addr constant <{ [110 x i8] }> <{ [110 x i8] c"unsafe precondition(s) violated: ptr::read_volatile requires that the pointer argument is aligned and non-null" }>, align 1
@alloc_20b3d155afd5c58c42e598b7e6d186ef = private unnamed_addr constant <{ [93 x i8] }> <{ [93 x i8] c"unsafe precondition(s) violated: NonNull::new_unchecked requires that the pointer is non-null" }>, align 1
@alloc_ab14703751a9eb3585c49b2e55e9a9e5 = private unnamed_addr constant <{ [104 x i8] }> <{ [104 x i8] c"unsafe precondition(s) violated: hint::assert_unchecked must never be called when the condition is false" }>, align 1
@alloc_cd1513ae8d1ae22acf9342b8dfa1561d = private unnamed_addr constant <{ [164 x i8] }> <{ [164 x i8] c"unsafe precondition(s) violated: Layout::from_size_align_unchecked requires that align is a power of 2 and the rounded-up allocation size does not exceed isize::MAX" }>, align 1
@1 = private unnamed_addr constant <{ [4 x i8], [4 x i8] }> <{ [4 x i8] c"\01\00\00\00", [4 x i8] undef }>, align 4
@alloc_763310d78c99c2c1ad3f8a9821e942f3 = private unnamed_addr constant <{ [61 x i8] }> <{ [61 x i8] c"is_nonoverlapping: `size_of::<T>() * count` overflows a usize" }>, align 1
@__rust_no_alloc_shim_is_unstable = external dso_local global i8
@alloc_68ac15728a1e6ba4743b718936db7fdf = private unnamed_addr constant <{ ptr, [4 x i8] }> <{ ptr inttoptr (i32 1 to ptr), [4 x i8] zeroinitializer }>, align 4
@alloc_83ea17bf0c4f4a5a5a13d3ae7955acd0 = private unnamed_addr constant <{ [4 x i8] }> zeroinitializer, align 4

; core::intrinsics::copy_nonoverlapping::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core10intrinsics19copy_nonoverlapping18precondition_check17hb34ce715b6f41134E(ptr %src, ptr %dst, i32 %size, i32 %align, i32 %count) unnamed_addr #0 {
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
  call void @_ZN4core9panicking9panic_fmt17hdc8d2d914c0710e4E(ptr align 4 %_14, ptr align 4 @alloc_825d86c8ab4aea810dd12a604502a33e) #10
  unreachable

bb1:                                              ; preds = %bb10
  %_21 = ptrtoint ptr %dst to i32
  %12 = icmp eq i32 %_21, 0
  br i1 %12, label %bb13, label %bb14

bb7:                                              ; preds = %bb4, %bb5, %bb6
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17hd6cf699a67f137cfE(ptr align 1 @alloc_8df0580a595a87d56789d20c7318e185, i32 166) #10
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
  call void @_ZN4core9panicking9panic_fmt17hdc8d2d914c0710e4E(ptr align 4 %_23, ptr align 4 @alloc_825d86c8ab4aea810dd12a604502a33e) #10
  unreachable

bb2:                                              ; preds = %bb15
; call core::ub_checks::is_nonoverlapping::runtime
  %_9 = call zeroext i1 @_ZN4core9ub_checks17is_nonoverlapping7runtime17hd41fa04766c92817E(ptr %src, ptr %dst, i32 %size, i32 %count) #11
  br i1 %_9, label %bb3, label %bb4

bb4:                                              ; preds = %bb2
  br label %bb7

bb3:                                              ; preds = %bb2
  ret void
}

; core::intrinsics::unlikely
; Function Attrs: nounwind
define internal zeroext i1 @_ZN4core10intrinsics8unlikely17h69abca60424be6dcE(i1 zeroext %b) unnamed_addr #1 {
start:
  ret i1 %b
}

; core::fmt::Arguments::new_v1
; Function Attrs: inlinehint nounwind
define dso_local void @_ZN4core3fmt9Arguments6new_v117hce3477d2e77795fcE(ptr sret([24 x i8]) align 4 %_0, ptr align 4 %pieces, ptr align 4 %args) unnamed_addr #0 {
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
define internal void @"_ZN4core3num23_$LT$impl$u20$usize$GT$13unchecked_mul18precondition_check17h065b15d38c512b20E"(i32 %lhs, i32 %rhs) unnamed_addr #0 {
start:
  %0 = call { i32, i1 } @llvm.umul.with.overflow.i32(i32 %lhs, i32 %rhs)
  %_6.0 = extractvalue { i32, i1 } %0, 0
  %_6.1 = extractvalue { i32, i1 } %0, 1
  br i1 %_6.1, label %bb1, label %bb2

bb2:                                              ; preds = %start
  ret void

bb1:                                              ; preds = %start
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17hd6cf699a67f137cfE(ptr align 1 @alloc_ffc44ed1670ebf78d81555edceff65f6, i32 69) #10
  unreachable
}

; core::ops::function::FnOnce::call_once
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core3ops8function6FnOnce9call_once17h7fee5fd667225f0eE(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %0, i32 %1) unnamed_addr #0 {
start:
  %_2 = alloca [8 x i8], align 4
  store ptr %0, ptr %_2, align 4
  %2 = getelementptr inbounds i8, ptr %_2, i32 4
  store i32 %1, ptr %2, align 4
  %3 = load ptr, ptr %_2, align 4
  %4 = getelementptr inbounds i8, ptr %_2, i32 4
  %5 = load i32, ptr %4, align 4
; call alloc::str::<impl alloc::borrow::ToOwned for str>::to_owned
  call void @"_ZN5alloc3str56_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$str$GT$8to_owned17h118b06471977f512E"(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %3, i32 %5) #11
  ret void
}

; core::ptr::read_volatile::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core3ptr13read_volatile18precondition_check17h38bf9306e7698ba4E(ptr %addr, i32 %align) unnamed_addr #0 {
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
  call void @_ZN4core9panicking14panic_nounwind17hd6cf699a67f137cfE(ptr align 1 @alloc_d4d2a2a8539eafc62756407d946babb3, i32 110) #10
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
  call void @_ZN4core9panicking9panic_fmt17hdc8d2d914c0710e4E(ptr align 4 %_8, ptr align 4 @alloc_825d86c8ab4aea810dd12a604502a33e) #10
  unreachable

bb1:                                              ; preds = %bb5
  ret void
}

; core::ptr::drop_in_place<alloc::string::String>
; Function Attrs: nounwind
define dso_local void @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h4423fa2e854a06e5E"(ptr align 4 %_1) unnamed_addr #1 {
start:
; call core::ptr::drop_in_place<alloc::vec::Vec<u8>>
  call void @"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h254661ada3a2edccE"(ptr align 4 %_1) #11
  ret void
}

; core::ptr::drop_in_place<alloc::vec::Vec<u8>>
; Function Attrs: nounwind
define dso_local void @"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h254661ada3a2edccE"(ptr align 4 %_1) unnamed_addr #1 {
start:
; call <alloc::vec::Vec<T,A> as core::ops::drop::Drop>::drop
  call void @"_ZN70_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h958a40c1e50f072bE"(ptr align 4 %_1) #11
; call core::ptr::drop_in_place<alloc::raw_vec::RawVec<u8>>
  call void @"_ZN4core3ptr53drop_in_place$LT$alloc..raw_vec..RawVec$LT$u8$GT$$GT$17heae1921527c7c09cE"(ptr align 4 %_1) #11
  ret void
}

; core::ptr::drop_in_place<alloc::raw_vec::RawVec<u8>>
; Function Attrs: nounwind
define dso_local void @"_ZN4core3ptr53drop_in_place$LT$alloc..raw_vec..RawVec$LT$u8$GT$$GT$17heae1921527c7c09cE"(ptr align 4 %_1) unnamed_addr #1 {
start:
; call <alloc::raw_vec::RawVec<T,A> as core::ops::drop::Drop>::drop
  call void @"_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h90877f0d47e284cbE"(ptr align 4 %_1) #11
  ret void
}

; core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17hecce86e6955ab040E"(ptr %ptr) unnamed_addr #0 {
start:
  %_4 = ptrtoint ptr %ptr to i32
  %0 = icmp eq i32 %_4, 0
  br i1 %0, label %bb1, label %bb2

bb1:                                              ; preds = %start
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17hd6cf699a67f137cfE(ptr align 1 @alloc_20b3d155afd5c58c42e598b7e6d186ef, i32 93) #10
  unreachable

bb2:                                              ; preds = %start
  ret void
}

; core::hint::assert_unchecked::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core4hint16assert_unchecked18precondition_check17h8ee4c2e3c7459b39E(i1 zeroext %cond) unnamed_addr #0 {
start:
  br i1 %cond, label %bb2, label %bb1

bb1:                                              ; preds = %start
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17hd6cf699a67f137cfE(ptr align 1 @alloc_ab14703751a9eb3585c49b2e55e9a9e5, i32 104) #10
  unreachable

bb2:                                              ; preds = %start
  ret void
}

; core::alloc::layout::Layout::from_size_align_unchecked::precondition_check
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core5alloc6layout6Layout25from_size_align_unchecked18precondition_check17hf2a3fcb6a23653c7E(i32 %size, i32 %align) unnamed_addr #0 {
start:
; call core::alloc::layout::Layout::is_size_align_valid
  %_3 = call zeroext i1 @_ZN4core5alloc6layout6Layout19is_size_align_valid17h98c8868b7a423354E(i32 %size, i32 %align) #11
  br i1 %_3, label %bb2, label %bb3

bb3:                                              ; preds = %start
; call core::panicking::panic_nounwind
  call void @_ZN4core9panicking14panic_nounwind17hd6cf699a67f137cfE(ptr align 1 @alloc_cd1513ae8d1ae22acf9342b8dfa1561d, i32 164) #10
  unreachable

bb2:                                              ; preds = %start
  ret void
}

; core::alloc::layout::Layout::repeat
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core5alloc6layout6Layout6repeat17h6b0969e1abf06b6aE(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %self, i32 %n) unnamed_addr #0 {
start:
  %0 = alloca [1 x i8], align 1
  %_16 = alloca [4 x i8], align 4
  %_14 = alloca [12 x i8], align 4
  %self3 = alloca [8 x i8], align 4
  %_11 = alloca [8 x i8], align 4
  %self2 = alloca [8 x i8], align 4
  %self1 = alloca [8 x i8], align 4
  %_7 = alloca [8 x i8], align 4
  %1 = getelementptr inbounds i8, ptr %self, i32 4
  %len = load i32, ptr %1, align 4
  %self4 = load i32, ptr %self, align 4
  store i32 %self4, ptr %_16, align 4
  %_17 = load i32, ptr %_16, align 4
  %_18 = icmp uge i32 %_17, 1
  %_19 = icmp ule i32 %_17, -2147483648
  %_20 = and i1 %_18, %_19
  %self5 = add i32 %len, %_17
  %_22 = sub i32 %self5, 1
  %_25 = sub i32 %_17, 1
  %_24 = xor i32 %_25, -1
  %len_rounded_up = and i32 %_22, %_24
  %_5 = sub i32 %len_rounded_up, %len
  %padded_size = add i32 %len, %_5
  %2 = call { i32, i1 } @llvm.umul.with.overflow.i32(i32 %padded_size, i32 %n)
  %_29.0 = extractvalue { i32, i1 } %2, 0
  %_29.1 = extractvalue { i32, i1 } %2, 1
  %3 = call i1 @llvm.expect.i1(i1 %_29.1, i1 false)
  %4 = zext i1 %3 to i8
  store i8 %4, ptr %0, align 1
  %5 = load i8, ptr %0, align 1
  %_26 = trunc i8 %5 to i1
  br i1 %_26, label %bb4, label %bb5

bb5:                                              ; preds = %start
  %6 = getelementptr inbounds i8, ptr %self2, i32 4
  store i32 %_29.0, ptr %6, align 4
  store i32 1, ptr %self2, align 4
  %7 = getelementptr inbounds i8, ptr %self2, i32 4
  %v = load i32, ptr %7, align 4
  %8 = getelementptr inbounds i8, ptr %self1, i32 4
  store i32 %v, ptr %8, align 4
  store i32 0, ptr %self1, align 4
  %9 = getelementptr inbounds i8, ptr %self1, i32 4
  %v6 = load i32, ptr %9, align 4
  %10 = getelementptr inbounds i8, ptr %_7, i32 4
  store i32 %v6, ptr %10, align 4
  store i32 0, ptr %_7, align 4
  %11 = getelementptr inbounds i8, ptr %_7, i32 4
  %alloc_size = load i32, ptr %11, align 4
  %_36 = sub i32 2147483647, %_25
  %_35 = icmp ugt i32 %alloc_size, %_36
  br i1 %_35, label %bb6, label %bb7

bb4:                                              ; preds = %start
  %12 = load i32, ptr @0, align 4
  %13 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store i32 %12, ptr %self2, align 4
  %14 = getelementptr inbounds i8, ptr %self2, i32 4
  store i32 %13, ptr %14, align 4
  %15 = load i32, ptr @1, align 4
  %16 = load i32, ptr getelementptr inbounds (i8, ptr @1, i32 4), align 4
  store i32 %15, ptr %self1, align 4
  %17 = getelementptr inbounds i8, ptr %self1, i32 4
  store i32 %16, ptr %17, align 4
  store i32 0, ptr %_0, align 4
  br label %bb1

bb7:                                              ; preds = %bb5
  store i32 %self4, ptr %self3, align 4
  %18 = getelementptr inbounds i8, ptr %self3, i32 4
  store i32 %alloc_size, ptr %18, align 4
  %v.0 = load i32, ptr %self3, align 4
  %19 = getelementptr inbounds i8, ptr %self3, i32 4
  %v.1 = load i32, ptr %19, align 4
  store i32 %v.0, ptr %_11, align 4
  %20 = getelementptr inbounds i8, ptr %_11, i32 4
  store i32 %v.1, ptr %20, align 4
  %layout.0 = load i32, ptr %_11, align 4
  %21 = getelementptr inbounds i8, ptr %_11, i32 4
  %layout.1 = load i32, ptr %21, align 4
  store i32 %layout.0, ptr %_14, align 4
  %22 = getelementptr inbounds i8, ptr %_14, i32 4
  store i32 %layout.1, ptr %22, align 4
  %23 = getelementptr inbounds i8, ptr %_14, i32 8
  store i32 %padded_size, ptr %23, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_0, ptr align 4 %_14, i32 12, i1 false)
  br label %bb2

bb6:                                              ; preds = %bb5
  %24 = load i32, ptr @0, align 4
  %25 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store i32 %24, ptr %self3, align 4
  %26 = getelementptr inbounds i8, ptr %self3, i32 4
  store i32 %25, ptr %26, align 4
  store i32 0, ptr %_0, align 4
  br label %bb1

bb2:                                              ; preds = %bb1, %bb7
  ret void

bb1:                                              ; preds = %bb4, %bb6
  br label %bb2
}

; core::ub_checks::is_nonoverlapping::runtime
; Function Attrs: inlinehint nounwind
define internal zeroext i1 @_ZN4core9ub_checks17is_nonoverlapping7runtime17hd41fa04766c92817E(ptr %src, ptr %dst, i32 %size, i32 %count) unnamed_addr #0 {
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
  call void @_ZN4core9panicking14panic_nounwind17hd6cf699a67f137cfE(ptr align 1 @alloc_763310d78c99c2c1ad3f8a9821e942f3, i32 61) #10
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
define dso_local void @"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17he91c2d91af1822a8E"(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %s.0, i32 %s.1) unnamed_addr #0 {
start:
  %v = alloca [12 x i8], align 4
; call alloc::raw_vec::RawVecInner<A>::with_capacity_in
  %0 = call { i32, ptr } @"_ZN5alloc7raw_vec20RawVecInner$LT$A$GT$16with_capacity_in17h22c52d07fc5d2224E"(i32 %s.1, i32 1, i32 1) #11
  %_10.0 = extractvalue { i32, ptr } %0, 0
  %_10.1 = extractvalue { i32, ptr } %0, 1
  store i32 %_10.0, ptr %v, align 4
  %1 = getelementptr inbounds i8, ptr %v, i32 4
  store ptr %_10.1, ptr %1, align 4
  %2 = getelementptr inbounds i8, ptr %v, i32 8
  store i32 0, ptr %2, align 4
  %3 = getelementptr inbounds i8, ptr %v, i32 4
  %self = load ptr, ptr %3, align 4
  br label %bb2

bb2:                                              ; preds = %start
; call core::intrinsics::copy_nonoverlapping::precondition_check
  call void @_ZN4core10intrinsics19copy_nonoverlapping18precondition_check17hb34ce715b6f41134E(ptr %s.0, ptr %self, i32 1, i32 1, i32 %s.1) #11
  br label %bb4

bb4:                                              ; preds = %bb2
  %4 = mul i32 %s.1, 1
  call void @llvm.memcpy.p0.p0.i32(ptr align 1 %self, ptr align 1 %s.0, i32 %4, i1 false)
  %5 = getelementptr inbounds i8, ptr %v, i32 8
  store i32 %s.1, ptr %5, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_0, ptr align 4 %v, i32 12, i1 false)
  ret void
}

; alloc::fmt::format
; Function Attrs: inlinehint nounwind
define internal void @_ZN5alloc3fmt6format17hd0da99e3d57dc1f7E(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %args) unnamed_addr #0 {
start:
  %0 = alloca [24 x i8], align 4
  %default = alloca [4 x i8], align 4
  %_4 = alloca [4 x i8], align 4
  %self = alloca [8 x i8], align 4
  %_5.0 = load ptr, ptr %args, align 4
  %1 = getelementptr inbounds i8, ptr %args, i32 4
  %_5.1 = load i32, ptr %1, align 4
  %2 = getelementptr inbounds i8, ptr %args, i32 8
  %_6.0 = load ptr, ptr %2, align 4
  %3 = getelementptr inbounds i8, ptr %2, i32 4
  %_6.1 = load i32, ptr %3, align 4
  %4 = icmp eq i32 %_5.1, 0
  br i1 %4, label %bb2, label %bb3

bb2:                                              ; preds = %start
  %5 = icmp eq i32 %_6.1, 0
  br i1 %5, label %bb6, label %bb1

bb3:                                              ; preds = %start
  %6 = icmp eq i32 %_5.1, 1
  br i1 %6, label %bb4, label %bb1

bb6:                                              ; preds = %bb2
  store ptr inttoptr (i32 1 to ptr), ptr %self, align 4
  %7 = getelementptr inbounds i8, ptr %self, i32 4
  store i32 0, ptr %7, align 4
  store ptr %args, ptr %_4, align 4
  %8 = load ptr, ptr %_4, align 4
  store ptr %8, ptr %default, align 4
  br label %bb8

bb1:                                              ; preds = %bb4, %bb3, %bb2
  %9 = load ptr, ptr @0, align 4
  %10 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store ptr %9, ptr %self, align 4
  %11 = getelementptr inbounds i8, ptr %self, i32 4
  store i32 %10, ptr %11, align 4
  store ptr %args, ptr %_4, align 4
  %12 = load ptr, ptr %_4, align 4
  store ptr %12, ptr %default, align 4
  %_14 = load ptr, ptr %_4, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %0, ptr align 4 %args, i32 24, i1 false)
; call alloc::fmt::format::format_inner
  call void @_ZN5alloc3fmt6format12format_inner17hddbef89a96ff6a91E(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %0) #11
  br label %bb7

bb8:                                              ; preds = %bb5, %bb6
  %t.0 = load ptr, ptr %self, align 4
  %13 = getelementptr inbounds i8, ptr %self, i32 4
  %t.1 = load i32, ptr %13, align 4
; call core::ops::function::FnOnce::call_once
  call void @_ZN4core3ops8function6FnOnce9call_once17h7fee5fd667225f0eE(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %t.0, i32 %t.1) #11
  br label %bb7

bb4:                                              ; preds = %bb3
  %14 = icmp eq i32 %_6.1, 0
  br i1 %14, label %bb5, label %bb1

bb5:                                              ; preds = %bb4
  %s = getelementptr inbounds [0 x { ptr, i32 }], ptr %_5.0, i32 0, i32 0
  %15 = getelementptr inbounds [0 x { ptr, i32 }], ptr %_5.0, i32 0, i32 0
  %_11.0 = load ptr, ptr %15, align 4
  %16 = getelementptr inbounds i8, ptr %15, i32 4
  %_11.1 = load i32, ptr %16, align 4
  store ptr %_11.0, ptr %self, align 4
  %17 = getelementptr inbounds i8, ptr %self, i32 4
  store i32 %_11.1, ptr %17, align 4
  store ptr %args, ptr %_4, align 4
  %18 = load ptr, ptr %_4, align 4
  store ptr %18, ptr %default, align 4
  br label %bb8

bb7:                                              ; preds = %bb1, %bb8
  ret void
}

; alloc::str::<impl alloc::borrow::ToOwned for str>::to_owned
; Function Attrs: inlinehint nounwind
define internal void @"_ZN5alloc3str56_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$str$GT$8to_owned17h118b06471977f512E"(ptr sret([12 x i8]) align 4 %_0, ptr align 1 %self.0, i32 %self.1) unnamed_addr #0 {
start:
  %bytes = alloca [12 x i8], align 4
; call <T as alloc::slice::hack::ConvertVec>::to_vec
  call void @"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17he91c2d91af1822a8E"(ptr sret([12 x i8]) align 4 %bytes, ptr align 1 %self.0, i32 %self.1) #11
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_0, ptr align 4 %bytes, i32 12, i1 false)
  ret void
}

; alloc::alloc::alloc
; Function Attrs: inlinehint nounwind
define internal ptr @_ZN5alloc5alloc5alloc17h3152db9a04c2bc9cE(i32 %0, i32 %1) unnamed_addr #0 {
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
  call void @_ZN4core3ptr13read_volatile18precondition_check17h38bf9306e7698ba4E(ptr @__rust_no_alloc_shim_is_unstable, i32 1) #11
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
define internal { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17h15e1cc4d15ea5858E(ptr align 1 %self, i32 %0, i32 %1, i1 zeroext %zeroed) unnamed_addr #0 {
start:
  %_38 = alloca [4 x i8], align 4
  %data4 = alloca [4 x i8], align 4
  %ptr = alloca [8 x i8], align 4
  %_28 = alloca [4 x i8], align 4
  %_20 = alloca [4 x i8], align 4
  %self3 = alloca [4 x i8], align 4
  %self2 = alloca [4 x i8], align 4
  %_11 = alloca [4 x i8], align 4
  %layout1 = alloca [8 x i8], align 4
  %raw_ptr = alloca [4 x i8], align 4
  %data = alloca [4 x i8], align 4
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
  %self5 = load i32, ptr %layout, align 4
  store i32 %self5, ptr %_20, align 4
  %_21 = load i32, ptr %_20, align 4
  %_22 = icmp uge i32 %_21, 1
  %_23 = icmp ule i32 %_21, -2147483648
  %_24 = and i1 %_22, %_23
  %ptr6 = getelementptr i8, ptr null, i32 %_21
  br label %bb7

bb1:                                              ; preds = %start
  br i1 %zeroed, label %bb3, label %bb4

bb7:                                              ; preds = %bb2
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17hecce86e6955ab040E"(ptr %ptr6) #11
  store ptr %ptr6, ptr %_28, align 4
  %5 = load ptr, ptr %_28, align 4
  store ptr %5, ptr %data, align 4
  store ptr %ptr6, ptr %data4, align 4
  store ptr %ptr6, ptr %ptr, align 4
  %6 = getelementptr inbounds i8, ptr %ptr, i32 4
  store i32 0, ptr %6, align 4
  br label %bb10

bb9:                                              ; No predecessors!
  unreachable

bb10:                                             ; preds = %bb7
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17hecce86e6955ab040E"(ptr %ptr6) #11
  br label %bb12

bb12:                                             ; preds = %bb10
  %_33.0 = load ptr, ptr %ptr, align 4
  %7 = getelementptr inbounds i8, ptr %ptr, i32 4
  %_33.1 = load i32, ptr %7, align 4
  store ptr %_33.0, ptr %_0, align 4
  %8 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %_33.1, ptr %8, align 4
  br label %bb6

bb6:                                              ; preds = %bb21, %bb14, %bb12
  %9 = load ptr, ptr %_0, align 4
  %10 = getelementptr inbounds i8, ptr %_0, i32 4
  %11 = load i32, ptr %10, align 4
  %12 = insertvalue { ptr, i32 } poison, ptr %9, 0
  %13 = insertvalue { ptr, i32 } %12, i32 %11, 1
  ret { ptr, i32 } %13

bb4:                                              ; preds = %bb1
  %14 = load i32, ptr %layout, align 4
  %15 = getelementptr inbounds i8, ptr %layout, i32 4
  %16 = load i32, ptr %15, align 4
; call alloc::alloc::alloc
  %17 = call ptr @_ZN5alloc5alloc5alloc17h3152db9a04c2bc9cE(i32 %14, i32 %16) #11
  store ptr %17, ptr %raw_ptr, align 4
  br label %bb5

bb3:                                              ; preds = %bb1
  %18 = load i32, ptr %layout, align 4
  %19 = getelementptr inbounds i8, ptr %layout, i32 4
  %20 = load i32, ptr %19, align 4
  store i32 %18, ptr %layout1, align 4
  %21 = getelementptr inbounds i8, ptr %layout1, i32 4
  store i32 %20, ptr %21, align 4
  %self7 = load i32, ptr %layout, align 4
  store i32 %self7, ptr %_38, align 4
  %_39 = load i32, ptr %_38, align 4
  %_40 = icmp uge i32 %_39, 1
  %_41 = icmp ule i32 %_39, -2147483648
  %_42 = and i1 %_40, %_41
  %22 = call ptr @__rust_alloc_zeroed(i32 %size, i32 %_39) #11
  store ptr %22, ptr %raw_ptr, align 4
  br label %bb5

bb5:                                              ; preds = %bb3, %bb4
  %ptr8 = load ptr, ptr %raw_ptr, align 4
  %_44 = ptrtoint ptr %ptr8 to i32
  %23 = icmp eq i32 %_44, 0
  br i1 %23, label %bb14, label %bb15

bb14:                                             ; preds = %bb5
  store ptr null, ptr %self3, align 4
  store ptr null, ptr %self2, align 4
  %24 = load ptr, ptr @0, align 4
  %25 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store ptr %24, ptr %_0, align 4
  %26 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %25, ptr %26, align 4
  br label %bb6

bb15:                                             ; preds = %bb5
  br label %bb16

bb16:                                             ; preds = %bb15
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17hecce86e6955ab040E"(ptr %ptr8) #11
  br label %bb18

bb18:                                             ; preds = %bb16
  store ptr %ptr8, ptr %self3, align 4
  %v = load ptr, ptr %self3, align 4
  store ptr %v, ptr %self2, align 4
  %v9 = load ptr, ptr %self2, align 4
  store ptr %v9, ptr %_11, align 4
  %ptr10 = load ptr, ptr %_11, align 4
  br label %bb19

bb19:                                             ; preds = %bb18
; call core::ptr::non_null::NonNull<T>::new_unchecked::precondition_check
  call void @"_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked18precondition_check17hecce86e6955ab040E"(ptr %ptr10) #11
  br label %bb21

bb21:                                             ; preds = %bb19
  store ptr %ptr10, ptr %_0, align 4
  %27 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %size, ptr %27, align 4
  br label %bb6
}

; alloc::raw_vec::RawVecInner<A>::deallocate
; Function Attrs: nounwind
define dso_local void @"_ZN5alloc7raw_vec20RawVecInner$LT$A$GT$10deallocate17hd8e6fe34bd7923feE"(ptr align 4 %self, i32 %elem_layout.0, i32 %elem_layout.1) unnamed_addr #1 {
start:
  %_3 = alloca [12 x i8], align 4
; call alloc::raw_vec::RawVecInner<A>::current_memory
  call void @"_ZN5alloc7raw_vec20RawVecInner$LT$A$GT$14current_memory17h55273a43a5490897E"(ptr sret([12 x i8]) align 4 %_3, ptr align 4 %self, i32 %elem_layout.0, i32 %elem_layout.1) #11
  %0 = getelementptr inbounds i8, ptr %_3, i32 4
  %1 = load i32, ptr %0, align 4
  %2 = icmp eq i32 %1, 0
  %_5 = select i1 %2, i32 0, i32 1
  %3 = icmp eq i32 %_5, 1
  br i1 %3, label %bb2, label %bb4

bb2:                                              ; preds = %start
  %ptr = load ptr, ptr %_3, align 4
  %4 = getelementptr inbounds i8, ptr %_3, i32 4
  %layout.0 = load i32, ptr %4, align 4
  %5 = getelementptr inbounds i8, ptr %4, i32 4
  %layout.1 = load i32, ptr %5, align 4
  %_9 = getelementptr inbounds i8, ptr %self, i32 8
; call <alloc::alloc::Global as core::alloc::Allocator>::deallocate
  call void @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17he393a88fa8034d43E"(ptr align 1 %_9, ptr %ptr, i32 %layout.0, i32 %layout.1) #11
  br label %bb4

bb4:                                              ; preds = %bb2, %start
  ret void

bb5:                                              ; No predecessors!
  unreachable
}

; alloc::raw_vec::RawVecInner<A>::current_memory
; Function Attrs: inlinehint nounwind
define dso_local void @"_ZN5alloc7raw_vec20RawVecInner$LT$A$GT$14current_memory17h55273a43a5490897E"(ptr sret([12 x i8]) align 4 %_0, ptr align 4 %self, i32 %0, i32 %1) unnamed_addr #0 {
start:
  %_21 = alloca [1 x i8], align 1
  %_20 = alloca [1 x i8], align 1
  %_19 = alloca [1 x i8], align 1
  %_18 = alloca [4 x i8], align 4
  %_17 = alloca [4 x i8], align 4
  %self2 = alloca [4 x i8], align 4
  %_13 = alloca [12 x i8], align 4
  %self1 = alloca [4 x i8], align 4
  %align = alloca [4 x i8], align 4
  %size = alloca [4 x i8], align 4
  %alloc_size = alloca [4 x i8], align 4
  %elem_layout = alloca [8 x i8], align 4
  store i32 %0, ptr %elem_layout, align 4
  %2 = getelementptr inbounds i8, ptr %elem_layout, i32 4
  store i32 %1, ptr %2, align 4
  %3 = getelementptr inbounds i8, ptr %elem_layout, i32 4
  %self3 = load i32, ptr %3, align 4
  %4 = icmp eq i32 %self3, 0
  br i1 %4, label %bb3, label %bb1

bb3:                                              ; preds = %bb2, %start
  %5 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 0, ptr %5, align 4
  br label %bb5

bb1:                                              ; preds = %start
  %_5 = load i32, ptr %self, align 4
  %6 = icmp eq i32 %_5, 0
  br i1 %6, label %bb2, label %bb4

bb2:                                              ; preds = %bb1
  br label %bb3

bb4:                                              ; preds = %bb1
  %rhs = load i32, ptr %self, align 4
  br label %bb6

bb5:                                              ; preds = %bb9, %bb3
  ret void

bb6:                                              ; preds = %bb4
; call core::num::<impl usize>::unchecked_mul::precondition_check
  call void @"_ZN4core3num23_$LT$impl$u20$usize$GT$13unchecked_mul18precondition_check17h065b15d38c512b20E"(i32 %self3, i32 %rhs) #11
  %7 = mul nuw i32 %self3, %rhs
  store i32 %7, ptr %alloc_size, align 4
  %8 = load i32, ptr %alloc_size, align 4
  store i32 %8, ptr %size, align 4
  store ptr %elem_layout, ptr %self1, align 4
  %9 = load i32, ptr %elem_layout, align 4
  store i32 %9, ptr %self2, align 4
  %10 = load i32, ptr %self2, align 4
  store i32 %10, ptr %_17, align 4
  %11 = load i32, ptr %_17, align 4
  store i32 %11, ptr %_18, align 4
  %12 = load i32, ptr %_18, align 4
  %13 = icmp uge i32 %12, 1
  %14 = zext i1 %13 to i8
  store i8 %14, ptr %_19, align 1
  %15 = load i32, ptr %_18, align 4
  %16 = icmp ule i32 %15, -2147483648
  %17 = zext i1 %16 to i8
  store i8 %17, ptr %_20, align 1
  %18 = load i8, ptr %_19, align 1
  %19 = trunc i8 %18 to i1
  %20 = load i8, ptr %_20, align 1
  %21 = trunc i8 %20 to i1
  %22 = and i1 %19, %21
  %23 = zext i1 %22 to i8
  store i8 %23, ptr %_21, align 1
  %24 = load i32, ptr %_18, align 4
  store i32 %24, ptr %align, align 4
  br label %bb8

bb7:                                              ; No predecessors!
  unreachable

bb8:                                              ; preds = %bb6
  %25 = load i32, ptr %alloc_size, align 4
  %26 = load i32, ptr %align, align 4
; call core::alloc::layout::Layout::from_size_align_unchecked::precondition_check
  call void @_ZN4core5alloc6layout6Layout25from_size_align_unchecked18precondition_check17hf2a3fcb6a23653c7E(i32 %25, i32 %26) #11
  br label %bb9

bb9:                                              ; preds = %bb8
  %_23 = load i32, ptr %align, align 4
  %layout.1 = load i32, ptr %alloc_size, align 4
  %27 = getelementptr inbounds i8, ptr %self, i32 4
  %self4 = load ptr, ptr %27, align 4
  store ptr %self4, ptr %_13, align 4
  %28 = getelementptr inbounds i8, ptr %_13, i32 4
  store i32 %_23, ptr %28, align 4
  %29 = getelementptr inbounds i8, ptr %28, i32 4
  store i32 %layout.1, ptr %29, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_0, ptr align 4 %_13, i32 12, i1 false)
  br label %bb5
}

; alloc::raw_vec::RawVecInner<A>::try_allocate_in
; Function Attrs: nounwind
define dso_local void @"_ZN5alloc7raw_vec20RawVecInner$LT$A$GT$15try_allocate_in17h3fca3403e600858aE"(ptr sret([12 x i8]) align 4 %_0, i32 %capacity, i1 zeroext %0, i32 %1, i32 %2) unnamed_addr #1 {
start:
  %_40 = alloca [4 x i8], align 4
  %self3 = alloca [12 x i8], align 4
  %self2 = alloca [8 x i8], align 4
  %self = alloca [8 x i8], align 4
  %result = alloca [8 x i8], align 4
  %_15 = alloca [8 x i8], align 4
  %elem_layout1 = alloca [8 x i8], align 4
  %_6 = alloca [12 x i8], align 4
  %layout = alloca [8 x i8], align 4
  %elem_layout = alloca [8 x i8], align 4
  %alloc = alloca [0 x i8], align 1
  %init = alloca [1 x i8], align 1
  %3 = zext i1 %0 to i8
  store i8 %3, ptr %init, align 1
  store i32 %1, ptr %elem_layout, align 4
  %4 = getelementptr inbounds i8, ptr %elem_layout, i32 4
  store i32 %2, ptr %4, align 4
  %5 = load i32, ptr %elem_layout, align 4
  %6 = getelementptr inbounds i8, ptr %elem_layout, i32 4
  %7 = load i32, ptr %6, align 4
  store i32 %5, ptr %elem_layout1, align 4
  %8 = getelementptr inbounds i8, ptr %elem_layout1, i32 4
  store i32 %7, ptr %8, align 4
; call core::alloc::layout::Layout::repeat
  call void @_ZN4core5alloc6layout6Layout6repeat17h6b0969e1abf06b6aE(ptr sret([12 x i8]) align 4 %self3, ptr align 4 %elem_layout1, i32 %capacity) #11
  %9 = load i32, ptr %self3, align 4
  %10 = icmp eq i32 %9, 0
  %_35 = select i1 %10, i32 1, i32 0
  %11 = icmp eq i32 %_35, 0
  br i1 %11, label %bb16, label %bb15

bb16:                                             ; preds = %start
  %t.0 = load i32, ptr %self3, align 4
  %12 = getelementptr inbounds i8, ptr %self3, i32 4
  %t.1 = load i32, ptr %12, align 4
  %13 = getelementptr inbounds i8, ptr %self3, i32 8
  %t = load i32, ptr %13, align 4
  store i32 %t.0, ptr %self2, align 4
  %14 = getelementptr inbounds i8, ptr %self2, i32 4
  store i32 %t.1, ptr %14, align 4
  %t.04 = load i32, ptr %self2, align 4
  %15 = getelementptr inbounds i8, ptr %self2, i32 4
  %t.15 = load i32, ptr %15, align 4
  %16 = getelementptr inbounds i8, ptr %_6, i32 4
  store i32 %t.04, ptr %16, align 4
  %17 = getelementptr inbounds i8, ptr %16, i32 4
  store i32 %t.15, ptr %17, align 4
  store i32 0, ptr %_6, align 4
  %18 = getelementptr inbounds i8, ptr %_6, i32 4
  %layout.0 = load i32, ptr %18, align 4
  %19 = getelementptr inbounds i8, ptr %18, i32 4
  %layout.1 = load i32, ptr %19, align 4
  store i32 %layout.0, ptr %layout, align 4
  %20 = getelementptr inbounds i8, ptr %layout, i32 4
  store i32 %layout.1, ptr %20, align 4
  %21 = icmp eq i32 %layout.1, 0
  br i1 %21, label %bb2, label %bb3

bb15:                                             ; preds = %start
  %22 = load i32, ptr @0, align 4
  %23 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store i32 %22, ptr %self2, align 4
  %24 = getelementptr inbounds i8, ptr %self2, i32 4
  store i32 %23, ptr %24, align 4
  %25 = load i32, ptr @0, align 4
  %26 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  %27 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %25, ptr %27, align 4
  %28 = getelementptr inbounds i8, ptr %27, i32 4
  store i32 %26, ptr %28, align 4
  store i32 1, ptr %_0, align 4
  br label %bb13

bb2:                                              ; preds = %bb16
  %self6 = load i32, ptr %elem_layout, align 4
  store i32 %self6, ptr %_40, align 4
  %_41 = load i32, ptr %_40, align 4
  %_42 = icmp uge i32 %_41, 1
  %_43 = icmp ule i32 %_41, -2147483648
  %_44 = and i1 %_42, %_43
  %ptr = getelementptr i8, ptr null, i32 %_41
  %29 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 0, ptr %29, align 4
  %30 = getelementptr inbounds i8, ptr %29, i32 4
  store ptr %ptr, ptr %30, align 4
  store i32 0, ptr %_0, align 4
  br label %bb12

bb3:                                              ; preds = %bb16
  %_46 = icmp ugt i32 %layout.1, 2147483647
  br i1 %_46, label %bb17, label %bb18

bb12:                                             ; preds = %bb13, %bb10, %bb2
  ret void

bb18:                                             ; preds = %bb3
  %31 = load i8, ptr %init, align 1
  %32 = trunc i8 %31 to i1
  %_19 = zext i1 %32 to i32
  %33 = icmp eq i32 %_19, 0
  br i1 %33, label %bb5, label %bb4

bb17:                                             ; preds = %bb3
  %34 = load i32, ptr @0, align 4
  %35 = load i32, ptr getelementptr inbounds (i8, ptr @0, i32 4), align 4
  store i32 %34, ptr %_15, align 4
  %36 = getelementptr inbounds i8, ptr %_15, i32 4
  store i32 %35, ptr %36, align 4
  %err.0 = load i32, ptr %_15, align 4
  %37 = getelementptr inbounds i8, ptr %_15, i32 4
  %err.1 = load i32, ptr %37, align 4
  %38 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %err.0, ptr %38, align 4
  %39 = getelementptr inbounds i8, ptr %38, i32 4
  store i32 %err.1, ptr %39, align 4
  store i32 1, ptr %_0, align 4
  br label %bb11

bb5:                                              ; preds = %bb18
; call <alloc::alloc::Global as core::alloc::Allocator>::allocate
  %40 = call { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$8allocate17h8ae46dc2cc4035b2E"(ptr align 1 %alloc, i32 %layout.0, i32 %layout.1) #11
  %41 = extractvalue { ptr, i32 } %40, 0
  %42 = extractvalue { ptr, i32 } %40, 1
  store ptr %41, ptr %result, align 4
  %43 = getelementptr inbounds i8, ptr %result, i32 4
  store i32 %42, ptr %43, align 4
  br label %bb8

bb4:                                              ; preds = %bb18
; call <alloc::alloc::Global as core::alloc::Allocator>::allocate_zeroed
  %44 = call { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$15allocate_zeroed17hba520df51d8aba24E"(ptr align 1 %alloc, i32 %layout.0, i32 %layout.1) #11
  %45 = extractvalue { ptr, i32 } %44, 0
  %46 = extractvalue { ptr, i32 } %44, 1
  store ptr %45, ptr %result, align 4
  %47 = getelementptr inbounds i8, ptr %result, i32 4
  store i32 %46, ptr %47, align 4
  br label %bb8

bb8:                                              ; preds = %bb4, %bb5
  %48 = load ptr, ptr %result, align 4
  %49 = ptrtoint ptr %48 to i32
  %50 = icmp eq i32 %49, 0
  %_22 = select i1 %50, i32 1, i32 0
  %51 = icmp eq i32 %_22, 0
  br i1 %51, label %bb10, label %bb9

bb10:                                             ; preds = %bb8
  %ptr.0 = load ptr, ptr %result, align 4
  %52 = getelementptr inbounds i8, ptr %result, i32 4
  %ptr.1 = load i32, ptr %52, align 4
  %53 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %capacity, ptr %53, align 4
  %54 = getelementptr inbounds i8, ptr %53, i32 4
  store ptr %ptr.0, ptr %54, align 4
  store i32 0, ptr %_0, align 4
  br label %bb12

bb9:                                              ; preds = %bb8
  store i32 %layout.0, ptr %self, align 4
  %55 = getelementptr inbounds i8, ptr %self, i32 4
  store i32 %layout.1, ptr %55, align 4
  %_24.0 = load i32, ptr %self, align 4
  %56 = getelementptr inbounds i8, ptr %self, i32 4
  %_24.1 = load i32, ptr %56, align 4
  %57 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %_24.0, ptr %57, align 4
  %58 = getelementptr inbounds i8, ptr %57, i32 4
  store i32 %_24.1, ptr %58, align 4
  store i32 1, ptr %_0, align 4
  br label %bb11

bb11:                                             ; preds = %bb17, %bb9
  br label %bb13

bb13:                                             ; preds = %bb15, %bb11
  br label %bb12

bb1:                                              ; No predecessors!
  unreachable
}

; alloc::raw_vec::RawVecInner<A>::with_capacity_in
; Function Attrs: inlinehint nounwind
define dso_local { i32, ptr } @"_ZN5alloc7raw_vec20RawVecInner$LT$A$GT$16with_capacity_in17h22c52d07fc5d2224E"(i32 %capacity, i32 %elem_layout.0, i32 %elem_layout.1) unnamed_addr #0 {
start:
  %self = alloca [4 x i8], align 4
  %elem_layout = alloca [8 x i8], align 4
  %this = alloca [8 x i8], align 4
  %_4 = alloca [12 x i8], align 4
; call alloc::raw_vec::RawVecInner<A>::try_allocate_in
  call void @"_ZN5alloc7raw_vec20RawVecInner$LT$A$GT$15try_allocate_in17h3fca3403e600858aE"(ptr sret([12 x i8]) align 4 %_4, i32 %capacity, i1 zeroext false, i32 %elem_layout.0, i32 %elem_layout.1) #11
  %_5 = load i32, ptr %_4, align 4
  %0 = icmp eq i32 %_5, 0
  br i1 %0, label %bb4, label %bb3

bb4:                                              ; preds = %start
  %1 = getelementptr inbounds i8, ptr %_4, i32 4
  %2 = load i32, ptr %1, align 4
  %3 = getelementptr inbounds i8, ptr %1, i32 4
  %4 = load ptr, ptr %3, align 4
  store i32 %2, ptr %this, align 4
  %5 = getelementptr inbounds i8, ptr %this, i32 4
  store ptr %4, ptr %5, align 4
  store i32 %elem_layout.0, ptr %elem_layout, align 4
  %6 = getelementptr inbounds i8, ptr %elem_layout, i32 4
  store i32 %elem_layout.1, ptr %6, align 4
  %7 = icmp eq i32 %elem_layout.1, 0
  br i1 %7, label %bb6, label %bb7

bb3:                                              ; preds = %start
  %8 = getelementptr inbounds i8, ptr %_4, i32 4
  %err.0 = load i32, ptr %8, align 4
  %9 = getelementptr inbounds i8, ptr %8, i32 4
  %err.1 = load i32, ptr %9, align 4
; call alloc::raw_vec::handle_error
  call void @_ZN5alloc7raw_vec12handle_error17h74551f64b6c1ed68E(i32 %err.0, i32 %err.1) #10
  unreachable

bb6:                                              ; preds = %bb4
  store i32 -1, ptr %self, align 4
  br label %bb5

bb7:                                              ; preds = %bb4
  %10 = load i32, ptr %this, align 4
  store i32 %10, ptr %self, align 4
  br label %bb5

bb5:                                              ; preds = %bb7, %bb6
  %11 = load i32, ptr %self, align 4
  %_13 = sub i32 %11, 0
  %_8 = icmp ugt i32 %capacity, %_13
  %cond = xor i1 %_8, true
  br label %bb8

bb8:                                              ; preds = %bb5
; call core::hint::assert_unchecked::precondition_check
  call void @_ZN4core4hint16assert_unchecked18precondition_check17h8ee4c2e3c7459b39E(i1 zeroext %cond) #11
  br label %bb9

bb9:                                              ; preds = %bb8
  %_0.0 = load i32, ptr %this, align 4
  %12 = getelementptr inbounds i8, ptr %this, i32 4
  %_0.1 = load ptr, ptr %12, align 4
  %13 = insertvalue { i32, ptr } poison, i32 %_0.0, 0
  %14 = insertvalue { i32, ptr } %13, ptr %_0.1, 1
  ret { i32, ptr } %14

bb2:                                              ; No predecessors!
  unreachable
}

; <alloc::alloc::Global as core::alloc::Allocator>::deallocate
; Function Attrs: inlinehint nounwind
define internal void @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17he393a88fa8034d43E"(ptr align 1 %self, ptr %ptr, i32 %0, i32 %1) unnamed_addr #0 {
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
define internal { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$15allocate_zeroed17hba520df51d8aba24E"(ptr align 1 %self, i32 %layout.0, i32 %layout.1) unnamed_addr #0 {
start:
; call alloc::alloc::Global::alloc_impl
  %0 = call { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17h15e1cc4d15ea5858E(ptr align 1 %self, i32 %layout.0, i32 %layout.1, i1 zeroext true) #11
  %_0.0 = extractvalue { ptr, i32 } %0, 0
  %_0.1 = extractvalue { ptr, i32 } %0, 1
  %1 = insertvalue { ptr, i32 } poison, ptr %_0.0, 0
  %2 = insertvalue { ptr, i32 } %1, i32 %_0.1, 1
  ret { ptr, i32 } %2
}

; <alloc::alloc::Global as core::alloc::Allocator>::allocate
; Function Attrs: inlinehint nounwind
define internal { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$8allocate17h8ae46dc2cc4035b2E"(ptr align 1 %self, i32 %layout.0, i32 %layout.1) unnamed_addr #0 {
start:
; call alloc::alloc::Global::alloc_impl
  %0 = call { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17h15e1cc4d15ea5858E(ptr align 1 %self, i32 %layout.0, i32 %layout.1, i1 zeroext false) #11
  %_0.0 = extractvalue { ptr, i32 } %0, 0
  %_0.1 = extractvalue { ptr, i32 } %0, 1
  %1 = insertvalue { ptr, i32 } poison, ptr %_0.0, 0
  %2 = insertvalue { ptr, i32 } %1, i32 %_0.1, 1
  ret { ptr, i32 } %2
}

; <alloc::vec::Vec<T,A> as core::ops::drop::Drop>::drop
; Function Attrs: nounwind
define dso_local void @"_ZN70_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h958a40c1e50f072bE"(ptr align 4 %self) unnamed_addr #1 {
start:
  %_12 = alloca [4 x i8], align 4
  %0 = getelementptr inbounds i8, ptr %self, i32 4
  %self1 = load ptr, ptr %0, align 4
  %1 = getelementptr inbounds i8, ptr %self, i32 8
  %len = load i32, ptr %1, align 4
  store i32 0, ptr %_12, align 4
  br label %bb3

bb3:                                              ; preds = %bb2, %start
  %2 = load i32, ptr %_12, align 4
  %_14 = icmp eq i32 %2, %len
  br i1 %_14, label %bb1, label %bb2

bb2:                                              ; preds = %bb3
  %3 = load i32, ptr %_12, align 4
  %_13 = getelementptr inbounds [0 x i8], ptr %self1, i32 0, i32 %3
  %4 = load i32, ptr %_12, align 4
  %5 = add i32 %4, 1
  store i32 %5, ptr %_12, align 4
  br label %bb3

bb1:                                              ; preds = %bb3
  ret void
}

; <alloc::raw_vec::RawVec<T,A> as core::ops::drop::Drop>::drop
; Function Attrs: nounwind
define dso_local void @"_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h90877f0d47e284cbE"(ptr align 4 %self) unnamed_addr #1 {
start:
; call alloc::raw_vec::RawVecInner<A>::deallocate
  call void @"_ZN5alloc7raw_vec20RawVecInner$LT$A$GT$10deallocate17hd8e6fe34bd7923feE"(ptr align 4 %self, i32 1, i32 1) #11
  ret void
}

; probe1::probe
; Function Attrs: nounwind
define dso_local void @_ZN6probe15probe17hf02b52887e37e451E() unnamed_addr #1 {
start:
  %_3.i = alloca [8 x i8], align 4
  %_7 = alloca [8 x i8], align 4
  %_6 = alloca [8 x i8], align 4
  %_3 = alloca [24 x i8], align 4
  %res = alloca [12 x i8], align 4
  %_1 = alloca [12 x i8], align 4
  store ptr @alloc_83ea17bf0c4f4a5a5a13d3ae7955acd0, ptr %_3.i, align 4
  %0 = getelementptr inbounds i8, ptr %_3.i, i32 4
  store ptr @"_ZN4core3fmt3num3imp55_$LT$impl$u20$core..fmt..LowerExp$u20$for$u20$isize$GT$3fmt17h9d6a85477abb03aeE", ptr %0, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_7, ptr align 4 %_3.i, i32 8, i1 false)
  %1 = getelementptr inbounds [1 x %"core::fmt::rt::Argument<'_>"], ptr %_6, i32 0, i32 0
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %1, ptr align 4 %_7, i32 8, i1 false)
; call core::fmt::Arguments::new_v1
  call void @_ZN4core3fmt9Arguments6new_v117hce3477d2e77795fcE(ptr sret([24 x i8]) align 4 %_3, ptr align 4 @alloc_68ac15728a1e6ba4743b718936db7fdf, ptr align 4 %_6) #11
; call alloc::fmt::format
  call void @_ZN5alloc3fmt6format17hd0da99e3d57dc1f7E(ptr sret([12 x i8]) align 4 %res, ptr align 4 %_3) #11
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_1, ptr align 4 %res, i32 12, i1 false)
; call core::ptr::drop_in_place<alloc::string::String>
  call void @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h4423fa2e854a06e5E"(ptr align 4 %_1) #11
  ret void
}

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i32 @llvm.ctpop.i32(i32) #2

; core::panicking::panic_nounwind
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking14panic_nounwind17hd6cf699a67f137cfE(ptr align 1, i32) unnamed_addr #3

; core::panicking::panic_fmt
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking9panic_fmt17hdc8d2d914c0710e4E(ptr align 4, ptr align 4) unnamed_addr #3

; core::fmt::num::imp::<impl core::fmt::LowerExp for isize>::fmt
; Function Attrs: nounwind
declare dso_local zeroext i1 @"_ZN4core3fmt3num3imp55_$LT$impl$u20$core..fmt..LowerExp$u20$for$u20$isize$GT$3fmt17h9d6a85477abb03aeE"(ptr align 4, ptr align 4) unnamed_addr #1

; Function Attrs: nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i32(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i32, i1 immarg) #4

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare { i32, i1 } @llvm.umul.with.overflow.i32(i32, i32) #2

; core::alloc::layout::Layout::is_size_align_valid
; Function Attrs: nounwind
declare dso_local zeroext i1 @_ZN4core5alloc6layout6Layout19is_size_align_valid17h98c8868b7a423354E(i32, i32) unnamed_addr #1

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(none)
declare i1 @llvm.expect.i1(i1, i1) #5

; alloc::fmt::format::format_inner
; Function Attrs: nounwind
declare dso_local void @_ZN5alloc3fmt6format12format_inner17hddbef89a96ff6a91E(ptr sret([12 x i8]) align 4, ptr align 4) unnamed_addr #1

; Function Attrs: nounwind allockind("alloc,uninitialized,aligned") allocsize(0)
declare dso_local noalias ptr @__rust_alloc(i32, i32 allocalign) unnamed_addr #6

; Function Attrs: nounwind allockind("alloc,zeroed,aligned") allocsize(0)
declare dso_local noalias ptr @__rust_alloc_zeroed(i32, i32 allocalign) unnamed_addr #7

; alloc::raw_vec::handle_error
; Function Attrs: cold noreturn nounwind
declare dso_local void @_ZN5alloc7raw_vec12handle_error17h74551f64b6c1ed68E(i32, i32) unnamed_addr #8

; Function Attrs: nounwind allockind("free")
declare dso_local void @__rust_dealloc(ptr allocptr, i32, i32) unnamed_addr #9

attributes #0 = { inlinehint nounwind "target-cpu"="generic" }
attributes #1 = { nounwind "target-cpu"="generic" }
attributes #2 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #3 = { cold noinline noreturn nounwind "target-cpu"="generic" }
attributes #4 = { nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #5 = { nocallback nofree nosync nounwind willreturn memory(none) }
attributes #6 = { nounwind allockind("alloc,uninitialized,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #7 = { nounwind allockind("alloc,zeroed,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #8 = { cold noreturn nounwind "target-cpu"="generic" }
attributes #9 = { nounwind allockind("free") "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #10 = { noreturn nounwind }
attributes #11 = { nounwind }

!llvm.ident = !{!0}

!0 = !{!"rustc version 1.82.0 (f6e511eec 2024-10-15)"}
