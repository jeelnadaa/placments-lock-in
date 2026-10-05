import java.util.*;

class Solution {
    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs) {
            sb.append(s.length()).append('#').append(s);
        }
        return sb.toString();
    }

    public List<String> decode(String s) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int slash = s.indexOf('#', i);
            int len = Integer.parseInt(s.substring(i, slash));
            i = slash + 1;
            res.add(s.substring(i, i + len));
            i += len;
        }
        return res;
    }

    public List<String> encodeDecode(List<String> strs) {
        return decode(encode(strs));
    }
}
