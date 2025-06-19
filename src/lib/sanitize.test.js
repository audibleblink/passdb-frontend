import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitize';

describe('sanitizeHtml', () => {
    it('should escape HTML tags', () => {
        const input = '<script>alert("XSS")</script>';
        const output = sanitizeHtml(input);
        expect(output).not.toContain('<script>');
        expect(output).toContain('&lt;script&gt;');
    });

    it('should escape dangerous attributes', () => {
        const input = '<img src=x onerror="alert(1)">';
        const output = sanitizeHtml(input);
        expect(output).toBe('&lt;img src=x onerror="alert(1)"&gt;');
    });

    it('should preserve plain text', () => {
        const input = 'This is plain text with no HTML';
        const output = sanitizeHtml(input);
        expect(output).toBe(input);
    });
});
