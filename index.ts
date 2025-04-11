import one from "@onecomme.com/onesdk";
import 'elexis';
import '@elexis.js/css';
import type { Comment } from "@onecomme.com/onesdk/types/Comment";

one.connect().then(async () => {
    const comments = await one.getComments();
    comments.forEach(comment => comment_manager.add(comment));
    $comment_container.content([
        comments.reverse().map($Comment)
    ])
});

const comment_manager = new Set<Comment>();

const discord_emoji = {
    'xwhoami': "1167679154888650792",
    'xnice': "1168565601984319641",
    'xthink': "1168568210640085003",
    'xnani': "1167679152246247515",
    'xhi': "1168507297178333228",
    'xlike': "1168473111339991050",
    'xwaah': "1168876280482111508",
    'xdrink': "1167679149255708754",
    'xhehe': "1234526566017536040",
    'xhaha': "1234493386770223146",
    'xpanic': "1234478850424180867",
    'xno': "1234466898125525044",
}

const url = new URL(location.href)
const params = {
    waterfall: url.searchParams.get('waterfall') === 'true',
    size: url.searchParams.get('size') ?? 24,
    color: url.searchParams.get('color') ?? '00ffff'
}

const $comment_container = $('div')
    .css({
        display: 'flex',
        flexDir: params.waterfall ? 'column' : 'row',
        gap: '1rem',
        pos: 'absolute',
        left: 0,
    })

function $Comment(comment: Comment) {
    return $('div')
        .css({
            maxW: '32rem',
            flexShrink: 0,
            transition: '0.3s all ease'
        })
        .content([
            $('div').class('header').css({display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem'}).content([
                $('img').src(comment.data.profileImage).css({bRadius: '50%', flexShrink: 0, h: '2em'}),
                $('div').class('name-container')
                    .css({
                        p: '0.2em 0.4em', 
                        bgColor: comment.data.isOwner ? `#${params.color}` : $.color.gray[300], 
                        color: comment.data.isOwner ? $.color.gray[800] : $.color.gray[600],
                        fontWeight: '700',
                        bRadius: '0.4em',
                        display: 'inline',
                        overflow: 'hidden',
                    })
                    .content([
                        $('div')
                            .css({
                                whiteSpace: 'nowrap',
                                txtOverflow: 'ellipsis',
                                overflow: 'hidden',
                                maxW: '16em'
                            })
                            .content(comment.data.name),
                    ]),
            ]),

            $('div').class('content-container')
                .css({
                    bgColor: `#00000050`,
                    p: '0.2rem 0.4rem',
                    bRadius: '0.4rem',
                    mT: '0.5rem',
                    color: 'white',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                })
                .content([
                    $('span').css({pos: 'absolute', h: '1rem', w: '0.2rem', bgColor: `#${params.color}`, bRadius: '0.2rem'}),
                    $('div')
                        .css({
                            mL: '0.6rem',
                            whiteSpace: 'nowrap',
                            txtOverflow: 'ellipsis',
                            overflow: 'hidden',
                            children: [
                                { selector: 'img', h: '1rem', transform: 'translateY(10%)'}
                            ]
                        })
                        .self($span => $span.dom.innerHTML = comment.data.comment.replaceAll(/(:([^:]+):)/g, (s1, s2, s3) => `${s3 in discord_emoji ? `<img src="https://cdn.discordapp.com/emojis/${discord_emoji[s3 as keyof typeof discord_emoji]}.webp?size=96">` : s1}`))
                ])
        ])
}
document.documentElement.style.fontSize = `${params.size}px`;
$(document.body)
.css({bgColor: '#00000030', fontFamily: 'Noto Sans SC'})
.content([
    $comment_container
])

one.subscribe({
    action: 'comments',
    callback: (res: Comment[]) => {
        res.forEach(comment => {
            if (comment_manager.has(comment)) return;
            comment_manager.add(comment);
            const $comment = $Comment(comment);
            $comment_container.insert($comment, 0)
            // .animate({
            //     left: [`-${$comment.offsetWidth + $.rem(1)}px`, `0`]
            // }, {
            //     duration: 300,
            //     fill: 'forwards',
            //     easing: 'ease',
            //     composite: 'replace'
            // }, () => {

            // })
            
        })
    }
})