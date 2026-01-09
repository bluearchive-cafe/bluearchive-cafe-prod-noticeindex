export default {
  async fetch(request, env) {
    const indexPath = "prod/index.json";
    const patchPath = "prod/patch.json";
    const cookie = request.headers.get("Cookie");
    const key = new URL(request.url).pathname.slice(1);
    const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });

    if (key === indexPath) {
      const index = JSON.parse(await env.NOTICEINDEX.get(indexPath));
      const patch = JSON.parse(await env.NOTICEINDEX.get(patchPath));
      const noticeindex = {
        ...index,
        ...patch,
        ...Object.fromEntries(
          Object.keys(index)
            .filter(k => Array.isArray(index[k]) && Array.isArray(patch[k]))
            .map(k => [k, [...index[k], ...patch[k]]])
        )
      };
      let uuid = cookie?.match(/uuid=([^;]+)/)?.[1];

      if (uuid) {
        const preferences = JSON.parse(await env.PREFERENCES.get(uuid));
        if (preferences.table) headers.append("Set-Cookie", `table=${preferences.table}; Path=/; Domain=bluearchive.cafe; Max-Age=2147483647`);
        if (preferences.asset) headers.append("Set-Cookie", `asset=${preferences.asset}; Path=/; Domain=bluearchive.cafe; Max-Age=2147483647`);
        if (preferences.voice) headers.append("Set-Cookie", `voice=${preferences.voice}; Path=/; Domain=bluearchive.cafe; Max-Age=2147483647`);
      } else {
        uuid = crypto.randomUUID();
        await env.PREFERENCES.put(uuid, JSON.stringify({ table: "cn", asset: "jp", voice: "jp" }));
        headers.append("Set-Cookie", `uuid=${uuid}; Path=/; Domain=bluearchive.cafe; Max-Age=2147483647`);
        headers.append("Set-Cookie", `table=cn; Path=/; Domain=bluearchive.cafe; Max-Age=2147483647`);
        headers.append("Set-Cookie", `asset=jp; Path=/; Domain=bluearchive.cafe; Max-Age=2147483647`);
        headers.append("Set-Cookie", `voice=jp; Path=/; Domain=bluearchive.cafe; Max-Age=2147483647`);
      }

      const notice = {
        "NoticeId": 0,
        "StartDate": "2026-01-01T00:00:00",
        "EndDate": "2099-12-31T00:00:00",
        "Url": `https://prod-notice.bluearchive.cafe/prod/bluearchive-cafe/dash/index.html?uuid=${uuid}`,
        "Title": "汉化偏好设置",
        "DisplayOrder": 0
      };
      noticeindex.Issues.unshift(notice)

      return new Response(JSON.stringify(noticeindex, null, 2), { headers });
    }

    return Response.redirect("https://prod-noticeindex.bluearchiveyostar.com/" + key, 302);
  }
};
