import java.io.*;
import java.lang.reflect.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;

public class Judge {

    // Simple JSON value representation
    public static class JsonVal {
        public Object val; // null, Boolean, Long, Double, String, List<JsonVal>, Map<String, JsonVal>

        public JsonVal(Object v) { this.val = v; }

        public boolean isNull() { return val == null; }
        public boolean asBool() { return (Boolean) val; }
        public long asLong() { return ((Number) val).longValue(); }
        public int asInt() { return ((Number) val).intValue(); }
        public double asDouble() { return ((Number) val).doubleValue(); }
        public String asString() { return (String) val; }
        @SuppressWarnings("unchecked")
        public List<JsonVal> asList() { return (List<JsonVal>) val; }
        @SuppressWarnings("unchecked")
        public Map<String, JsonVal> asMap() { return (Map<String, JsonVal>) val; }
    }

    public static class JsonParser {
        private final String src;
        private int idx = 0;

        public JsonParser(String src) { this.src = src; }

        public JsonVal parse() {
            skipWhitespace();
            if (idx >= src.length()) return new JsonVal(null);
            char c = src.charAt(idx);
            if (c == 'n') { idx += 4; return new JsonVal(null); }
            if (c == 't') { idx += 4; return new JsonVal(Boolean.TRUE); }
            if (c == 'f') { idx += 5; return new JsonVal(Boolean.FALSE); }
            if (c == '"') return new JsonVal(parseString());
            if (c == '[') return new JsonVal(parseArray());
            if (c == '{') return new JsonVal(parseObject());
            return new JsonVal(parseNumber());
        }

        private void skipWhitespace() {
            while (idx < src.length() && Character.isWhitespace(src.charAt(idx))) idx++;
        }

        private String parseString() {
            idx++; // skip '"'
            StringBuilder sb = new StringBuilder();
            while (idx < src.length()) {
                char c = src.charAt(idx++);
                if (c == '"') break;
                if (c == '\\') {
                    if (idx >= src.length()) break;
                    char esc = src.charAt(idx++);
                    if (esc == 'n') sb.append('\n');
                    else if (esc == 't') sb.append('\t');
                    else if (esc == 'r') sb.append('\r');
                    else if (esc == '"') sb.append('"');
                    else if (esc == '\\') sb.append('\\');
                    else sb.append(esc);
                } else {
                    sb.append(c);
                }
            }
            return sb.toString();
        }

        private Number parseNumber() {
            int start = idx;
            boolean isFloat = false;
            if (src.charAt(idx) == '-') idx++;
            while (idx < src.length()) {
                char c = src.charAt(idx);
                if (Character.isDigit(c)) idx++;
                else if (c == '.' || c == 'e' || c == 'E' || c == '+') { isFloat = true; idx++; }
                else break;
            }
            String numStr = src.substring(start, idx);
            if (isFloat) return Double.parseDouble(numStr);
            return Long.parseLong(numStr);
        }

        private List<JsonVal> parseArray() {
            idx++; // skip '['
            List<JsonVal> list = new ArrayList<>();
            skipWhitespace();
            if (idx < src.length() && src.charAt(idx) == ']') { idx++; return list; }
            while (idx < src.length()) {
                list.add(parse());
                skipWhitespace();
                if (idx < src.length() && src.charAt(idx) == ',') { idx++; skipWhitespace(); }
                else if (idx < src.length() && src.charAt(idx) == ']') { idx++; break; }
            }
            return list;
        }

        private Map<String, JsonVal> parseObject() {
            idx++; // skip '{'
            Map<String, JsonVal> map = new LinkedHashMap<>();
            skipWhitespace();
            if (idx < src.length() && src.charAt(idx) == '}') { idx++; return map; }
            while (idx < src.length()) {
                skipWhitespace();
                String key = parseString();
                skipWhitespace();
                if (idx < src.length() && src.charAt(idx) == ':') idx++;
                JsonVal val = parse();
                map.put(key, val);
                skipWhitespace();
                if (idx < src.length() && src.charAt(idx) == ',') { idx++; skipWhitespace(); }
                else if (idx < src.length() && src.charAt(idx) == '}') { idx++; break; }
            }
            return map;
        }
    }

    public static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof Boolean) return obj.toString();
        if (obj instanceof Number) return obj.toString();
        if (obj instanceof Character) return "\"" + obj + "\"";
        if (obj instanceof String) {
            String s = (String) obj;
            return "\"" + s.replace("\\", "\\\\")
                           .replace("\"", "\\\"")
                           .replace("\n", "\\n")
                           .replace("\r", "\\r")
                           .replace("\t", "\\t") + "\"";
        }
        if (obj instanceof int[]) {
            int[] arr = (int[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(arr[i]);
            }
            return sb.append("]").toString();
        }
        if (obj instanceof long[]) {
            long[] arr = (long[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(arr[i]);
            }
            return sb.append("]").toString();
        }
        if (obj instanceof double[]) {
            double[] arr = (double[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(arr[i]);
            }
            return sb.append("]").toString();
        }
        if (obj instanceof boolean[]) {
            boolean[] arr = (boolean[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(arr[i]);
            }
            return sb.append("]").toString();
        }
        if (obj instanceof char[]) {
            char[] arr = (char[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append("\"").append(arr[i]).append("\"");
            }
            return sb.append("]").toString();
        }
        if (obj instanceof Object[]) {
            Object[] arr = (Object[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(arr[i]));
            }
            return sb.append("]").toString();
        }
        if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(list.get(i)));
            }
            return sb.append("]").toString();
        }
        if (obj instanceof ListNode) {
            return serializeListNode((ListNode) obj);
        }
        if (obj instanceof TreeNode) {
            return serializeTreeNode((TreeNode) obj);
        }
        if (obj instanceof Node) {
            return serializeGraphNode((Node) obj);
        }
        return "\"" + obj.toString() + "\"";
    }

    public static String serializeListNode(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        ListNode curr = head;
        Set<ListNode> seen = new HashSet<>();
        int count = 0;
        while (curr != null) {
            if (seen.contains(curr)) {
                // Cycle detected in output
                break;
            }
            seen.add(curr);
            if (count > 0) sb.append(",");
            sb.append(curr.val);
            curr = curr.next;
            count++;
            if (count > 50000) break; // safety guard
        }
        sb.append("]");
        return sb.toString();
    }

    public static String serializeTreeNode(TreeNode root) {
        if (root == null) return "[]";
        List<String> list = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node == null) {
                list.add("null");
            } else {
                list.add(String.valueOf(node.val));
                q.offer(node.left);
                q.offer(node.right);
            }
        }
        // Trim trailing nulls
        int end = list.size() - 1;
        while (end >= 0 && "null".equals(list.get(end))) end--;
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i <= end; i++) {
            if (i > 0) sb.append(",");
            sb.append(list.get(i));
        }
        sb.append("]");
        return sb.toString();
    }

    public static String serializeGraphNode(Node node) {
        if (node == null) return "[]";
        Map<Integer, Node> map = new TreeMap<>();
        Queue<Node> q = new LinkedList<>();
        q.offer(node);
        map.put(node.val, node);
        while (!q.isEmpty()) {
            Node curr = q.poll();
            if (curr.neighbors != null) {
                for (Node nbr : curr.neighbors) {
                    if (nbr != null && !map.containsKey(nbr.val)) {
                        map.put(nbr.val, nbr);
                        q.offer(nbr);
                    }
                }
            }
        }
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;
        for (Map.Entry<Integer, Node> entry : map.entrySet()) {
            if (!first) sb.append(",");
            first = false;
            sb.append("[");
            Node n = entry.getValue();
            if (n.neighbors != null) {
                for (int i = 0; i < n.neighbors.size(); i++) {
                    if (i > 0) sb.append(",");
                    sb.append(n.neighbors.get(i).val);
                }
            }
            sb.append("]");
        }
        sb.append("]");
        return sb.toString();
    }

    public static TreeNode findTreeNode(TreeNode root, int val) {
        if (root == null) return null;
        if (root.val == val) return root;
        TreeNode left = findTreeNode(root.left, val);
        if (left != null) return left;
        return findTreeNode(root.right, val);
    }

    // Convert JsonVal to specified Java type
    public static Object convertType(JsonVal jv, String type, Map<String, JsonVal> allInputs) {
        if (jv == null || jv.isNull()) return null;
        type = type.trim();
        if ("int".equals(type) || "Integer".equals(type)) return jv.asInt();
        if ("long".equals(type) || "Long".equals(type)) return jv.asLong();
        if ("double".equals(type) || "Double".equals(type)) return jv.asDouble();
        if ("boolean".equals(type) || "Boolean".equals(type)) return jv.asBool();
        if ("char".equals(type) || "Character".equals(type)) {
            String s = jv.asString();
            return s.isEmpty() ? ' ' : s.charAt(0);
        }
        if ("String".equals(type)) return jv.asString();

        if ("int[]".equals(type)) {
            List<JsonVal> l = jv.asList();
            int[] res = new int[l.size()];
            for (int i = 0; i < l.size(); i++) res[i] = l.get(i).asInt();
            return res;
        }
        if ("long[]".equals(type)) {
            List<JsonVal> l = jv.asList();
            long[] res = new long[l.size()];
            for (int i = 0; i < l.size(); i++) res[i] = l.get(i).asLong();
            return res;
        }
        if ("double[]".equals(type)) {
            List<JsonVal> l = jv.asList();
            double[] res = new double[l.size()];
            for (int i = 0; i < l.size(); i++) res[i] = l.get(i).asDouble();
            return res;
        }
        if ("char[]".equals(type)) {
            List<JsonVal> l = jv.asList();
            char[] res = new char[l.size()];
            for (int i = 0; i < l.size(); i++) {
                String s = l.get(i).asString();
                res[i] = s.isEmpty() ? ' ' : s.charAt(0);
            }
            return res;
        }
        if ("String[]".equals(type)) {
            List<JsonVal> l = jv.asList();
            String[] res = new String[l.size()];
            for (int i = 0; i < l.size(); i++) res[i] = l.get(i).asString();
            return res;
        }
        if ("int[][]".equals(type)) {
            List<JsonVal> rows = jv.asList();
            int[][] res = new int[rows.size()][];
            for (int i = 0; i < rows.size(); i++) {
                List<JsonVal> cols = rows.get(i).asList();
                res[i] = new int[cols.size()];
                for (int j = 0; j < cols.size(); j++) res[i][j] = cols.get(j).asInt();
            }
            return res;
        }
        if ("char[][]".equals(type)) {
            List<JsonVal> rows = jv.asList();
            char[][] res = new char[rows.size()][];
            for (int i = 0; i < rows.size(); i++) {
                List<JsonVal> cols = rows.get(i).asList();
                res[i] = new char[cols.size()];
                for (int j = 0; j < cols.size(); j++) {
                    String s = cols.get(j).asString();
                    res[i][j] = s.isEmpty() ? ' ' : s.charAt(0);
                }
            }
            return res;
        }
        if ("List<Integer>".equals(type)) {
            List<JsonVal> l = jv.asList();
            List<Integer> res = new ArrayList<>();
            for (JsonVal item : l) res.add(item.asInt());
            return res;
        }
        if ("List<String>".equals(type)) {
            List<JsonVal> l = jv.asList();
            List<String> res = new ArrayList<>();
            for (JsonVal item : l) res.add(item.asString());
            return res;
        }
        if ("List<List<Integer>>".equals(type)) {
            List<JsonVal> outer = jv.asList();
            List<List<Integer>> res = new ArrayList<>();
            for (JsonVal inner : outer) {
                List<JsonVal> list = inner.asList();
                List<Integer> row = new ArrayList<>();
                for (JsonVal it : list) row.add(it.asInt());
                res.add(row);
            }
            return res;
        }
        if ("List<List<String>>".equals(type)) {
            List<JsonVal> outer = jv.asList();
            List<List<String>> res = new ArrayList<>();
            for (JsonVal inner : outer) {
                List<JsonVal> list = inner.asList();
                List<String> row = new ArrayList<>();
                for (JsonVal it : list) row.add(it.asString());
                res.add(row);
            }
            return res;
        }
        if ("ListNode".equals(type)) {
            List<JsonVal> vals = jv.asList();
            if (vals.isEmpty()) return null;
            ListNode dummy = new ListNode(0);
            ListNode curr = dummy;
            List<ListNode> nodes = new ArrayList<>();
            for (JsonVal v : vals) {
                ListNode node = new ListNode(v.asInt());
                nodes.add(node);
                curr.next = node;
                curr = node;
            }
            // Check if pos parameter is present for cycle
            if (allInputs != null && allInputs.containsKey("pos")) {
                int pos = allInputs.get("pos").asInt();
                if (pos >= 0 && pos < nodes.size()) {
                    curr.next = nodes.get(pos);
                }
            }
            return dummy.next;
        }
        if ("ListNode[]".equals(type)) {
            List<JsonVal> outer = jv.asList();
            ListNode[] res = new ListNode[outer.size()];
            for (int i = 0; i < outer.size(); i++) {
                res[i] = (ListNode) convertType(outer.get(i), "ListNode", null);
            }
            return res;
        }
        if ("TreeNode".equals(type)) {
            if (jv.val instanceof Number) {
                int target = jv.asInt();
                if (allInputs != null && allInputs.containsKey("root")) {
                    JsonVal rootJv = allInputs.get("root");
                    TreeNode fullTree = (TreeNode) convertType(rootJv, "TreeNode", null);
                    TreeNode found = findTreeNode(fullTree, target);
                    if (found != null) return found;
                }
                return new TreeNode(target);
            }
            List<JsonVal> vals = jv.asList();
            if (vals.isEmpty() || vals.get(0).isNull()) return null;
            TreeNode root = new TreeNode(vals.get(0).asInt());
            Queue<TreeNode> q = new LinkedList<>();
            q.offer(root);
            int i = 1;
            while (!q.isEmpty() && i < vals.size()) {
                TreeNode parent = q.poll();
                if (i < vals.size()) {
                    JsonVal leftVal = vals.get(i++);
                    if (leftVal != null && !leftVal.isNull()) {
                        parent.left = new TreeNode(leftVal.asInt());
                        q.offer(parent.left);
                    }
                }
                if (i < vals.size()) {
                    JsonVal rightVal = vals.get(i++);
                    if (rightVal != null && !rightVal.isNull()) {
                        parent.right = new TreeNode(rightVal.asInt());
                        q.offer(parent.right);
                    }
                }
            }
            return root;
        }
        if ("Node".equals(type)) {
            List<JsonVal> adjList = jv.asList();
            if (adjList == null || adjList.isEmpty()) return null;
            int n = adjList.size();
            Node[] nodes = new Node[n + 1];
            for (int i = 1; i <= n; i++) {
                nodes[i] = new Node(i);
            }
            for (int i = 1; i <= n; i++) {
                List<JsonVal> nbrs = adjList.get(i - 1).asList();
                for (JsonVal nb : nbrs) {
                    nodes[i].neighbors.add(nodes[nb.asInt()]);
                }
            }
            return nodes[1];
        }

        return jv.val;
    }

    // Stream capture for stdout with 10 KB cap
    public static class CappedOutputStream extends ByteArrayOutputStream {
        private final int maxCap;
        public CappedOutputStream(int cap) { this.maxCap = cap; }
        @Override
        public synchronized void write(int b) {
            if (count < maxCap) super.write(b);
        }
        @Override
        public synchronized void write(byte[] b, int off, int len) {
            if (count + len <= maxCap) {
                super.write(b, off, len);
            } else if (count < maxCap) {
                super.write(b, off, maxCap - count);
            }
        }
    }

    public static void main(String[] args) throws Exception {
        // Read JSON payload from stdin or file argument
        String inputJson;
        if (args.length > 0) {
            inputJson = new String(java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(args[0])), StandardCharsets.UTF_8);
        } else {
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) sb.append(line).append("\n");
            }
            inputJson = sb.toString();
        }

        JsonParser parser = new JsonParser(inputJson);
        JsonVal root = parser.parse();
        Map<String, JsonVal> rootMap = root.asMap();

        String className = rootMap.get("className").asString();
        String methodName = rootMap.containsKey("methodName") ? rootMap.get("methodName").asString() : "";
        String kind = rootMap.containsKey("kind") ? rootMap.get("kind").asString() : "function";
        int timeLimitMs = rootMap.containsKey("timeLimitMs") ? rootMap.get("timeLimitMs").asInt() : 2000;

        List<JsonVal> paramDefs = rootMap.containsKey("params") ? rootMap.get("params").asList() : Collections.emptyList();
        List<JsonVal> tests = rootMap.get("tests").asList();

        Class<?> clazz = Class.forName(className);

        // Pre-find target method for function kind
        Method targetMethod = null;
        if (!"class".equals(kind)) {
            for (Method m : clazz.getDeclaredMethods()) {
                if (m.getName().equals(methodName)) {
                    targetMethod = m;
                    targetMethod.setAccessible(true);
                    break;
                }
            }
            if (targetMethod == null) {
                System.err.println("Method " + methodName + " not found in " + className);
                System.exit(2);
            }
        }

        PrintStream originalOut = System.out;
        PrintStream originalErr = System.err;

        List<String> resultsJson = new ArrayList<>();

        for (int testIdx = 0; testIdx < tests.size(); testIdx++) {
            JsonVal testCase = tests.get(testIdx);
            Map<String, JsonVal> testMap = testCase.asMap();
            int caseIndex = testMap.containsKey("index") ? testMap.get("index").asInt() : testIdx;
            Map<String, JsonVal> inputsMap = testMap.get("inputs").asMap();

            CappedOutputStream stdoutCapture = new CappedOutputStream(10240);
            PrintStream capturePs = new PrintStream(stdoutCapture, true, "UTF-8");

            final Method fTargetMethod = targetMethod;
            final Object[] resultHolder = new Object[1];
            final Throwable[] errorHolder = new Throwable[1];
            final long[] runtimeHolder = new long[1];

            Runnable task = () -> {
                System.setOut(capturePs);
                long start = System.nanoTime();
                try {
                    if ("class".equals(kind)) {
                        // Class design problem (e.g. Trie, MedianFinder)
                        List<JsonVal> ops = inputsMap.get("operations").asList();
                        List<JsonVal> opArgs = inputsMap.get("args").asList();
                        List<Object> opResults = new ArrayList<>();
                        Object instance = null;

                        for (int opIdx = 0; opIdx < ops.size(); opIdx++) {
                            String op = ops.get(opIdx).asString();
                            List<JsonVal> argVals = opArgs.get(opIdx).asList();

                            if (opIdx == 0 && op.equals(className)) {
                                // Constructor
                                Constructor<?> ctor = clazz.getDeclaredConstructor();
                                ctor.setAccessible(true);
                                instance = ctor.newInstance();
                                opResults.add(null);
                            } else {
                                Method opMethod = null;
                                for (Method m : clazz.getDeclaredMethods()) {
                                    if (m.getName().equals(op)) { opMethod = m; break; }
                                }
                                if (opMethod == null) throw new NoSuchMethodException(op);
                                opMethod.setAccessible(true);
                                Class<?>[] pTypes = opMethod.getParameterTypes();
                                Object[] callArgs = new Object[pTypes.length];
                                for (int a = 0; a < pTypes.length; a++) {
                                    callArgs[a] = convertType(argVals.get(a), pTypes[a].getSimpleName(), null);
                                }
                                Object ret = opMethod.invoke(instance, callArgs);
                                opResults.add(ret);
                            }
                        }
                        resultHolder[0] = opResults;
                    } else {
                        // Standard function or in-place function
                        Object instance = clazz.getDeclaredConstructor().newInstance();
                        Object[] callArgs = new Object[paramDefs.size()];
                        for (int p = 0; p < paramDefs.size(); p++) {
                            Map<String, JsonVal> pDef = paramDefs.get(p).asMap();
                            String pName = pDef.get("name").asString();
                            String pType = pDef.get("type").asString();
                            callArgs[p] = convertType(inputsMap.get(pName), pType, inputsMap);
                        }

                        Object ret = fTargetMethod.invoke(instance, callArgs);

                        if ("treenode-val".equals(kind)) {
                            resultHolder[0] = (ret instanceof TreeNode) ? ((TreeNode) ret).val : ret;
                        } else if (kind.startsWith("inplace:")) {
                            int inplaceIdx = Integer.parseInt(kind.substring("inplace:".length()));
                            resultHolder[0] = callArgs[inplaceIdx];
                        } else {
                            resultHolder[0] = ret;
                        }
                    }
                } catch (Throwable t) {
                    errorHolder[0] = t instanceof InvocationTargetException ? ((InvocationTargetException) t).getTargetException() : t;
                } finally {
                    runtimeHolder[0] = (System.nanoTime() - start) / 1_000_000;
                    System.setOut(originalOut);
                }
            };

            // Run in a daemon thread with 64MB stack depth so timeout terminates the process
            ThreadGroup group = new ThreadGroup("judge-group");
            Thread workerThread = new Thread(group, task, "judge-worker-" + testIdx, 64 * 1024 * 1024);
            workerThread.setDaemon(true);
            workerThread.start();

            try {
                workerThread.join(timeLimitMs + 100);
            } catch (InterruptedException ie) {
                // ignore
            }

            System.setOut(originalOut);
            System.setErr(originalErr);

            boolean isTimeout = false;
            if (workerThread.isAlive()) {
                isTimeout = true;
                workerThread.interrupt();
            }

            String capturedStdout = stdoutCapture.toString("UTF-8");

            StringBuilder item = new StringBuilder("{");
            item.append("\"index\":").append(caseIndex).append(",");
            item.append("\"runtimeMs\":").append(runtimeHolder[0]).append(",");
            item.append("\"stdout\":").append(toJson(capturedStdout)).append(",");

            if (isTimeout) {
                item.append("\"verdict\":\"Time Limit Exceeded\",");
                item.append("\"error\":\"Time Limit Exceeded (exceeded ").append(timeLimitMs).append("ms)\"");
            } else if (errorHolder[0] != null) {
                Throwable err = errorHolder[0];
                if (err instanceof OutOfMemoryError) {
                    item.append("\"verdict\":\"Memory Limit Exceeded\",");
                    item.append("\"error\":\"Memory Limit Exceeded\"");
                } else {
                    item.append("\"verdict\":\"Runtime Error\",");
                    StringWriter sw = new StringWriter();
                    err.printStackTrace(new PrintWriter(sw));
                    item.append("\"error\":").append(toJson(err.getClass().getName() + ": " + err.getMessage())).append(",");
                    item.append("\"stackTrace\":").append(toJson(sw.toString()));
                }
            } else {
                item.append("\"verdict\":\"OK\",");
                item.append("\"actual\":").append(toJson(resultHolder[0]));
            }
            item.append("}");
            resultsJson.add(item.toString());

            // If timeout or runtime error occurred, we can stop early
            if (isTimeout || errorHolder[0] != null) {
                break;
            }
        }

        // Print final JSON array of results to original stdout
        originalOut.print("[" + String.join(",", resultsJson) + "]");
        originalOut.flush();
        System.exit(0);
    }
}
