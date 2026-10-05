import java.util.*;

class Solution {
    public int countComponents(int n, int[][] edges) {
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int count = n;
        for (int[] e : edges) {
            int root1 = find(parent, e[0]);
            int root2 = find(parent, e[1]);
            if (root1 != root2) {
                parent[root1] = root2;
                count--;
            }
        }
        return count;
    }

    private int find(int[] parent, int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent, parent[i]);
    }
}
