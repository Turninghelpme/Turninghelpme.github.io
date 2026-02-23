#include <stdio.h>
#include <stdlib.h>

// 变量声明
int A = 0;

int main() {
    // === 程序开始 ===
    // TODO: 未处理的卡片类型 ">"
    A = 5;
    while (A > 0) {
    printf("%g\n", (double)A);
    A--;
    }
    return 0;
}
