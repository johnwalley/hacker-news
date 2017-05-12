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

test('real-world example', () => {
  var text = "<p><i>To use Ghostscript for free, Hancom would have to adhere to its open-source license, the GNU General Public License (GPL). The GNU GPL requires that when you use GPL-licensed software to make some other software, the resulting software also has to be open-sourced with the same license if it’s released to the public. That means Hancom would have to open-source its entire suite of apps.</i><p><i>Alternatively, Hancom could pay Artifex a licensing fee. Artifex allows developers of commercial or otherwise closed-source software to forego the strict open-source terms of the GNU GPL if they’re willing to pay for it.</i><p>This obligation has been termed &quot;reciprocity,&quot; and it lies at the heart of many open source business models.<p><a href=\"http:&#x2F;&#x2F;www.rosenlaw.com&#x2F;pdf-files&#x2F;Rosen_Ch06.pdf\" rel=\"nofollow\">http:&#x2F;&#x2F;www.rosenlaw.com&#x2F;pdf-files&#x2F;Rosen_Ch06.pdf</a><p>The more important issue here is reciprocity, not whether an open source license should be considered to be a contract.<p>AFAIK, the reciprocity provision of any version of the GPL hasn&#x27;t been tested in any meaningful way within the US. In particular, the specific use cases that trigger reciprocity remain cloudy at best in my mind.<p>Some companies claim that merely linking to a GPLed library is sufficient to trigger reciprocity. FSF published the LGPL specifically to address this point.<p>So I believe a ruling on reciprocity would be ground breaking.";
  var expected = "To use Ghostscript for free, Hancom would have to adhere to its open-source license, the GNU General Public License (GPL). The GNU GPL requires that when you use GPL-licensed software to make some other software, the resulting software also has to be open-sourced with the same license if it’s released to the public. That means Hancom would have to open-source its entire suite of apps.\n\nAlternatively, Hancom could pay Artifex a licensing fee. Artifex allows developers of commercial or otherwise closed-source software to forego the strict open-source terms of the GNU GPL if they’re willing to pay for it.\n\nThis obligation has been termed \"reciprocity,\" and it lies at the heart of many open source business models.\n\nhttp://www.rosenlaw.com/pdf-files/Rosen_Ch06.pdf\n\nThe more important issue here is reciprocity, not whether an open source license should be considered to be a contract.\n\nAFAIK, the reciprocity provision of any version of the GPL hasn\'t been tested in any meaningful way within the US. In particular, the specific use cases that trigger reciprocity remain cloudy at best in my mind.\n\nSome companies claim that merely linking to a GPLed library is sufficient to trigger reciprocity. FSF published the LGPL specifically to address this point.\n\nSo I believe a ruling on reciprocity would be ground breaking."

  expect(transformCommentText(text)).toBe(expected);
});
