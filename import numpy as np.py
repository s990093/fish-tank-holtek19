import numpy as np

# 定義複數 i
i = 1j  # Python 中複數用 1j 表示

# 定義矩陣 B2
B2 = np.array([[i, -i, 0],
               [-i, i, 0],
               [i, -i, -2*i]])

# 計算 B2 的 4 次方
B2_4 = np.linalg.matrix_power(B2, 8.                                   )

# 印出結果
print(B2_4)
