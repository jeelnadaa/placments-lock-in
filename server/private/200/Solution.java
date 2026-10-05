import java.util.*;

class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    explore(grid, r, c);
                }
            }
        }
        return count;
    }

    private void explore(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        explore(grid, r + 1, c);
        explore(grid, r - 1, c);
        explore(grid, r, c + 1);
        explore(grid, r, c - 1);
    }
}
