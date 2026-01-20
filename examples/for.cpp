#include <stdio.h>
#include <stdlib.h>
#include <iostream>
using namespace std;

// 变量声明
int num = 0;

int main() {
    // === 程序开始 ===
    std::cin >> num;
    for (; num <= 0; num += 0) {
    std::cout << num << std::endl;
    }
    return 0;
}
