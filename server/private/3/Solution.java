import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int max = 0, start = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (last[c] >= start) {
                start = last[c] + 1;
            }
            last[c] = i;
            if (i - start + 1 > max) max = i - start + 1;
        }
        return max;
    }
}
