package co.edu.uniamazonia.artmatrix.infrastructure.security;

import co.edu.uniamazonia.artmatrix.application.port.GeneradorTokenPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Component
public class JwtGeneradorToken implements GeneradorTokenPort {

    private final JwtEncoder encoder;
    private final Duration validez;

    public JwtGeneradorToken(JwtEncoder encoder, @Value("${artmatrix.jwt.horas-validez:12}") long horas) {
        this.encoder = encoder;
        this.validez = Duration.ofHours(horas);
    }

    @Override
    public String generar(Integer idEstudiante, String usuario) {
        Instant ahora = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("artmatrix")
                .subject(String.valueOf(idEstudiante))
                .claim("usuario", usuario)
                .issuedAt(ahora)
                .expiresAt(ahora.plus(validez))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
