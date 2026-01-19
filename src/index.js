export default {
    async fetch(request, env, ctx) {
        const pathname = new URL(request.url).pathname.slice(1)
        const pathparts = pathname.split("/");
        const uuid = pathparts.shift();
        const key = pathparts.join("/");
        const indexPath = "prod/index.json";
        const patchPath = "prod/patch.json";
        const statusKey = "status.json";
        const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });

        if (pathname === indexPath || pathname === patchPath) return new Response(await env.NOTICEINDEX.get(pathname), { headers });
        else if (key === indexPath) {
            const noticeindex = JSON.parse(await env.NOTICEINDEX.get(indexPath));
            //const patch = JSON.parse(await env.NOTICEINDEX.get(patchPath));
            //const status = JSON.parse(await env.RESOURCESTATUS.get(statusKey));
            //const noticeindex = Object.fromEntries(
            //    Object.keys({ ...index, ...patch }).map(k =>
            //        [k, Array.isArray(index[k]) && Array.isArray(patch[k]) ? [...index[k], ...patch[k]] : patch[k] ?? index[k]]
            //    )
            //);
            const dash = {
                "NoticeId": 0,
                "StartDate": "2026-01-01T00:00:00",
                "EndDate": "2099-12-31T23:59:59",
                "Url": `https://bluearchive.cafe/dash.html?uuid=${uuid}`,
                "Title": "蔚蓝咖啡厅控制面板",
                "DisplayOrder": 0
            };
            const popup = {
                "GuidePopupId": 0,
                "GuidePopupType": 1,
                "PopupType": 2,
                "StartDate": "2026-01-01T00:00:00",
                "EndDate": "2099-12-31T23:59:59",
                "FileName": "banner.png",
                "Url": "https://bluearchive.cafe/assets/images/",
                "Message": "　因版本更新，部分汉化功能暂时失效　请老师耐心等待修复完成！",
                "SurveyId": 0,
                "NotifyUrl": null,
                "GotoUrl": "https://bluearchive.cafe/status",
                "DisplayOrder": 0,
                "PopupOKText": "查看"
            }
            //if (
            //    status.table.official.version !== status.table.localized.version ||
            //    status.asset.official.version !== status.asset.localized.version ||
            //    status.media.official.version !== status.media.localized.version
            //) noticeindex.GuidePopup.push(popup);
            noticeindex.Issues.push(dash);
            return new Response(JSON.stringify(noticeindex, null, 2), { headers });
        }

        return Response.redirect("https://prod-noticeindex.bluearchiveyostar.com/" + key, 302);
    }
};
