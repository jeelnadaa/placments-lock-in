import java.util.*;

class Solution {
    private int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        List<List<Integer>> res = new ArrayList<>();
        if (heights == null || heights.length == 0) return res;
        int m = heights.length, n = heights[0].length;
        boolean[][] pac = new boolean[m][n];
        boolean[][] atl = new boolean[m][n];
        for (int i = 0; i < m; i++) {
            flow(heights, pac, i, 0, heights[i][0]);
            flow(heights, atl, i, n - 1, heights[i][n - 1]);
        }
        for (int j = 0; j < n; j++) {
            flow(heights, pac, 0, j, heights[0][j]);
            flow(heights, atl, m - 1, j, heights[m - 1][j]);
        }
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (pac[i][j] && atl[i][j]) {
                    res.add(Arrays.asList(i, j));
                }
            }
        }
        return res;
    }

    private void flow(int[][] h, boolean[][] ocean, int r, int c, int prevH) {
        if (r < 0 || r >= h.length || c < 0 || c >= h[0].length || ocean[r][c] || h[r][c] < prevH) return;
        ocean[r][c] = true;
        for (int[] d : dirs) {
            flow(h, ocean, r + d[0], c + d[1], h[r][c]);
        }
    }
}
