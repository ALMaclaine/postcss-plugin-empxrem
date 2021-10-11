const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('works', async () => {
  await run('a{ padding: 16px; }', 'a{ padding: 1.0000rem; }', { });
  await run('a{ padding: 10px; }', 'a{ padding: 0.6250rem; }', { });

  await run('a{ padding: 16px; }', 'a{ padding: 1.0000em; }', { em: true });
  await run('a{ padding: 10px; }', 'a{ padding: 0.6250em; }', { em: true });

  await run('a{ padding: 10px; }', 'a{ padding: 1.0000rem; }', { base: 10 });

  await run('a{ padding: 16px 16px; }', 'a{ padding: 1.0000rem 1.0000rem; }', { });
  await run('a{ padding: 10px 10px; }', 'a{ padding: 0.6250rem 0.6250rem; }', { });
  await run('a{ padding: 10px 10px; }', 'a{ padding: 1.0000rem 1.0000rem; }', { base: 10 });
});
