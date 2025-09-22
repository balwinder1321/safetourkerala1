// UniqueIdGenerator.java
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

public class UniqueIdGenerator {
    public static String generate(String name, String kyc) {
        String safe = name.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        String p = safe.length() >= 3 ? safe.substring(0,3) : safe;
        String suf = kyc.length() >= 4 ? kyc.substring(kyc.length()-4) : kyc;
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        return "ST-" + p + "-" + suf + "-" + ts;
    }
    public static void main(String[] args){
        System.out.println(generate("Balwinder Singh","A123456789"));
    }
}
