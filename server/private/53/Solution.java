import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int maxSubArray(int[] nums) {
        int max = nums[0];
        int cur = 0;
        for (int x : nums) {
            cur += x;
            if (cur > max) max = cur;
            if (cur < 0) cur = 0;
        }
        return max;
    }
}
