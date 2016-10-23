
function love.load()
   printx = 0
   printy = 0
end

function love.mousemoved( x, y, dx, dy, istouch )
	printx = x
	printy = y
end

function love.draw()
	love.graphics.print('S', 400, 300)

	a,b,c = love.audio.getPosition()
	love.graphics.print('Listener position: '..a..', '..b..', '..c, 0, 40)

	love.graphics.print('Mouse position: '..printx..', '..printy, 0, 0)

	numSources = love.audio.getSourceCount()
	if numSources == 0 then
		startSound()
	end
	love.graphics.print('Sound sources: '..numSources, 0, 20)

	love.audio.setPosition(printx,printy,0)
end

function startSound()
	sound = love.audio.newSource("mono.mp3", "static")
	sound:setPosition(400,300,0)
	sound:setAttenuationDistances(50,800)
	sound:play()
end


function love.load()
   printx = 0
   printy = 0
end

function love.mousemoved( x, y, dx, dy, istouch )
	printx = x
	printy = y
end

