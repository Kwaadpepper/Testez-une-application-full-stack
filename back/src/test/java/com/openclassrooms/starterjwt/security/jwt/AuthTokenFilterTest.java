package com.openclassrooms.starterjwt.security.jwt;

import java.io.IOException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

public class AuthTokenFilterTest {
    private SecurityContext securityContext;
    private JwtUtils jwtUtils;
    private UserDetailsService userDetailsService;
    private AuthTokenFilter authTokenFilter;

    public AuthTokenFilterTest() {
        this.jwtUtils = Mockito.mock(JwtUtils.class);
        this.userDetailsService = Mockito.mock(UserDetailsServiceImpl.class);
        this.authTokenFilter = new AuthTokenFilter();
        ReflectionTestUtils.setField(authTokenFilter, "jwtUtils", jwtUtils);
        ReflectionTestUtils.setField(authTokenFilter, "userDetailsService", userDetailsService);
    }

    @BeforeEach
    public void init() {
        this.securityContext = Mockito.mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void canDoFilterAnyNonAuthenticatedRequest() throws IOException, ServletException {
        // Arrange
        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
        HttpServletResponse response = Mockito.mock(HttpServletResponse.class);
        FilterChain filterChain = Mockito.mock(FilterChain.class);

        Mockito.when(request.getHeader(Mockito.any(String.class))).thenReturn(null);
        Mockito.doNothing().when(filterChain).doFilter(
                Mockito.any(HttpServletRequest.class),
                Mockito.any(HttpServletResponse.class));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        Mockito.verify(filterChain).doFilter(
                Mockito.any(HttpServletRequest.class),
                Mockito.any(HttpServletResponse.class));
    }

    @Test
    public void canDoFilterAnyAuthenticatedRequestWithInvalidBearer() throws IOException, ServletException {
        // Arrange
        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
        HttpServletResponse response = Mockito.mock(HttpServletResponse.class);
        FilterChain filterChain = Mockito.mock(FilterChain.class);

        Mockito.when(request.getHeader(Mockito.any(String.class))).thenReturn("Bearer superWrongToken");
        Mockito.when(jwtUtils.validateJwtToken(Mockito.any(String.class))).thenReturn(false);
        Mockito.doNothing().when(filterChain).doFilter(
                Mockito.any(HttpServletRequest.class),
                Mockito.any(HttpServletResponse.class));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        Mockito.verify(filterChain).doFilter(
                Mockito.any(HttpServletRequest.class),
                Mockito.any(HttpServletResponse.class));
    }

    @Test
    public void canDoFilterAnyAuthenticatedRequestWithValidBearer() throws IOException, ServletException {
        // Arrange
        HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
        HttpServletResponse response = Mockito.mock(HttpServletResponse.class);
        FilterChain filterChain = Mockito.mock(FilterChain.class);
        UserDetails userDetails = Mockito.mock(UserDetails.class);

        Mockito.when(request.getHeader(Mockito.any(String.class))).thenReturn("Bearer superGoodToken");
        Mockito.when(jwtUtils.validateJwtToken(Mockito.any(String.class))).thenReturn(true);
        Mockito.when(jwtUtils.getUserNameFromJwtToken(Mockito.any(String.class)))
                .thenReturn("user@example.net");
        Mockito.when(userDetailsService.loadUserByUsername(Mockito.any(String.class))).thenReturn(userDetails);
        Mockito.when(userDetails.getAuthorities()).thenReturn(List.of());
        Mockito.doNothing().when(securityContext)
                .setAuthentication(Mockito.any(UsernamePasswordAuthenticationToken.class));
        Mockito.doNothing().when(filterChain).doFilter(
                Mockito.any(HttpServletRequest.class),
                Mockito.any(HttpServletResponse.class));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        Mockito.verify(filterChain).doFilter(
                Mockito.any(HttpServletRequest.class),
                Mockito.any(HttpServletResponse.class));
    }
}
