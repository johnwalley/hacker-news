import { transformCommentText } from '../App/index';

test('html entities', () => {
  expect(transformCommentText('&lt;&gt;&#x27;&#x2F;&quot;')).toBe('<>\'/"');
});

test('paragraph tags', () => {
  expect(transformCommentText('<p>paragraph<p>')).toBe('paragraph\n\n');
});

test('formatting tags', () => {
  expect(transformCommentText('<i>italic</i>')).toBe('italic');
});

/*
    .replace(/^<p>/, '')
    .replace(/<p>/g, '\n\n')
    .replace(/&#x27;/g, '\'')
    .replace(/&#x2F;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<i>/, '')
    .replace(/<\/i>/, '')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)" rel="nofollow">(.*)?<\/a>/g, "$1");
    */