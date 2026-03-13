---
title: 回溯法经典例题
toc: true
tags:
  - 算法
abbrlink: 8a50cea9
date: 2020-06-16 13:57:23
categories: 算法
---

编写一个由1-9组成的9位数，并且数字不重复，前N项能被N整除。

```
#include <iostream>
using namespace std;

int number = 0;
int visited[10] = {1, 0, 0, 0, 0, 0, 0, 0, 0, 0};

void makenumber(int n) {
    if (n < 1) {
        cout << "ERROR!" << endl;
        return;
    }
    if (n == 10) {
        cout << number << endl;
    }
    for (int j = 1; j <= 9; ++j) {
        if (!visited[j]) {
            int temp = number;
            temp = temp * 10 + j;
            if (temp % n == 0) {
                number = temp;
                visited[j] = 1;
                makenumber(n + 1);
                number = number / 10;
                visited[j] = 0;//BackTracking
            }
        }
    }
}

int main() {
    makenumber(1);
    return 0;
}

```

本题主要是采用了递归回溯法，读者需自行分析。我没有进行数学分析，只是盲目的暴力枚举。